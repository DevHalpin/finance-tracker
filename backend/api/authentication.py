import jwt
import requests
import os
from jwt import algorithms
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from dotenv import load_dotenv
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.cache import cache

load_dotenv(os.path.join(settings.BASE_DIR, '.env'))

CLERK_JWKS_URL = os.getenv('JWKS_URL')
CLERK_ISSUER = os.getenv('CLERK_ISSUER')

def get_clerk_public_keys():
    """
    Retrieve the public keys for the Clerk JWKS endpoint using a cache to avoid repeated requests.
    The cache is set to expire after 24 hours.
    """
    public_keys = cache.get('clerk_jwks')
    if public_keys is None:
        try:
            jwks_response = requests.get(CLERK_JWKS_URL)
            jwks_response.raise_for_status()
            jwks = jwks_response.json()

            public_keys = {
                jwk['kid']: algorithms.RSAAlgorithm.from_jwk(jwk)
                for jwk in jwks['keys']
            }

            cache.set('clerk_jwks', public_keys, 86400) 
        except (requests.RequestException, KeyError, ValueError) as e:
            raise AuthenticationFailed(f"Could not fetch, parse, or process JWKS: {e}")
    return public_keys

class ClerkJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None
        
        token = auth_header.split(' ')[1]

        try: 
            public_keys = get_clerk_public_keys()
            unverified_header = jwt.get_unverified_header(token)
            key_id = unverified_header.get('kid')
            
            if not key_id:
                raise AuthenticationFailed('JWT header missing key ID (kid).')

            key = public_keys.get(key_id)

            if key is None:
                cache.delete('clerk_jwks')
                public_keys = get_clerk_public_keys()
                key = public_keys.get(key_id)
                if key is None:
                    raise AuthenticationFailed('Public key for token could not be found.')
                
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
