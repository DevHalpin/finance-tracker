import json
import urllib.request
from django.conf import settings
from rest_framework import authentication, exceptions
import jwt
from jwt import get_unverified_header
from cryptography.x509 import load_pem_x509_certificate
from cryptography.hazmat.backends import default_backend
from django.contrib.auth import get_user_model

class Auth0JWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        print("Authenticating with Auth0...")
        auth_header = authentication.get_authorization_header(request).split()

        if not auth_header or auth_header[0].lower() != b'bearer':
            return None

        if len(auth_header) != 2:
            raise exceptions.AuthenticationFailed('Invalid Authorization header format.')

        token = auth_header[1].decode('utf-8')
        

        try:
            unverified_header = get_unverified_header(token)
            kid = unverified_header.get('kid')
            if not kid:
                raise exceptions.AuthenticationFailed('JWT header missing "kid"')
        except jwt.PyJWTError:
            raise exceptions.AuthenticationFailed('Invalid JWT header')

        jwks_url = f"https://{settings.AUTH0_DOMAIN}/.well-known/jwks.json"
        try:
            with urllib.request.urlopen(jwks_url) as response:
                jwks = json.load(response)
        except Exception as e:
            raise exceptions.AuthenticationFailed(f"Could not fetch JWKS: {str(e)}")

        rsa_key = None
        for key in jwks['keys']:
            if key['kid'] == kid:
                cert_str = f"-----BEGIN CERTIFICATE-----\n{key['x5c'][0]}\n-----END CERTIFICATE-----"
                cert_obj = load_pem_x509_certificate(cert_str.encode(), default_backend())
                rsa_key = cert_obj.public_key()
                break

        if not rsa_key:
            raise exceptions.AuthenticationFailed('Unable to find matching key in JWKS.')

        try:
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=['RS256'],
                audience=settings.API_IDENTIFIER,
                issuer=f"https://{settings.AUTH0_DOMAIN}/",
            )
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token has expired.')
        except jwt.InvalidAudienceError:
            raise exceptions.AuthenticationFailed('Invalid audience.')
        except jwt.InvalidIssuerError:
            raise exceptions.AuthenticationFailed('Invalid issuer.')
        except jwt.PyJWTError as e:
            raise exceptions.AuthenticationFailed(f'Token is invalid: {str(e)}')

        user = self.get_or_create_user(payload)
        return (user, None)

    def get_or_create_user(self, payload):
        User = get_user_model()
        auth0_user_id = payload.get('sub')  # e.g., 'auth0|abc123'

        if not auth0_user_id:
            raise exceptions.AuthenticationFailed('Token missing subject claim')

        user, _ = User.objects.get_or_create(username=auth0_user_id)
        return user
