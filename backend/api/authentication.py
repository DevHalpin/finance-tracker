import jwt
import requests
import os
import json
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

def get_clerk_jwks_data():
    """
    Retrieves Clerk's JWKS data, using a cache to avoid repeated network requests.
    Caches the raw JSON response text for 24 hours.
    """
    jwks_data = cache.get('clerk_jwks_raw')
    if jwks_data is None:
        try:
            response = requests.get(CLERK_JWKS_URL)
            response.raise_for_status()
            jwks_data = response.json()
            # Cache the raw JSON data for 24 hours
            cache.set('clerk_jwks_raw', jwks_data, timeout=86400)
        except requests.RequestException as e:
            raise AuthenticationFailed(f"Could not fetch JWKS: {e}")
    return jwks_data

class ClerkJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None
        
        token = auth_header.split(' ')[1]

        try:
            jwks = get_clerk_jwks_data()
            public_keys = {
                jwk['kid']: algorithms.RSAAlgorithm.from_jwk(jwk)
                for jwk in jwks['keys']
            }

            unverified_header = jwt.get_unverified_header(token)
            key_id = unverified_header.get('kid')

            if not key_id:
                raise AuthenticationFailed('JWT header missing key ID (kid).')

            key = public_keys.get(key_id)

            if key is None:
                # Key not found, cache might be stale. Clear and retry once.
                cache.delete('clerk_jwks_raw')
                jwks = get_clerk_jwks_data()
                public_keys = {
                    jwk['kid']: algorithms.RSAAlgorithm.from_jwk(jwk)
                    for jwk in jwks['keys']
                }
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

        except jwt.InvalidTokenError as e:
            raise AuthenticationFailed(f'JWT validation failed: {str(e)}')
        except Exception as e:
            raise AuthenticationFailed(f'An unexpected error occurred during authentication: {str(e)}')
