import jwt
import requests
import os
from jwt import algorithms
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from dotenv import load_dotenv
from django.conf import settings
from django.contrib.auth import get_user_model

load_dotenv(os.path.join(settings.BASE_DIR, '.env'))

CLERK_JWKS_URL = os.getenv('JWKS_URL')
CLERK_ISSUER = os.getenv('CLERK_ISSUER')

class ClerkJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None
        
        token = auth_header.split(' ')[1]

        try: 
            jwks = requests.get(CLERK_JWKS_URL).json()
            public_keys = {
                jwk['kid']: algorithms.RSAAlgorithm.from_jwk(jwk)
                for jwk in jwks['keys']
            }

            unverified_header = jwt.get_unverified_header(token)
            key = public_keys.get(unverified_header['kid'])

            if key is None:
                raise AuthenticationFailed('Invalid key ID')

            payload = jwt.decode(
                token,
                key=key,
                algorithms=['RS256'],
                issuer=CLERK_ISSUER
            )

            email = payload.get('email')
            if not email:
                raise AuthenticationFailed("JWT payload missing 'email' claim.")

            User = get_user_model()
            user, created = User.objects.get_or_create(
                email=email,
                defaults={'username': email.split('@')[0]}
            )

            return (user, payload)

        except Exception as e:
            raise AuthenticationFailed(f'JWT validation failed: {str(e)}')
