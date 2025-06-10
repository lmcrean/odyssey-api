import os

# Set environment variables before importing settings
os.environ['DEV'] = '1'
os.environ['DJANGO_DEBUG'] = 'True'

from drf_api.settings import *

# Use in-memory SQLite database for tests
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }
}

# Keep the ROOT_URLCONF from the main settings
ROOT_URLCONF = 'drf_api.urls'

# Set test secrets
SECRET_KEY = 'test-secret-key-for-authentication-testing'

# Update SIMPLE_JWT to use test secret
SIMPLE_JWT.update({
    'SIGNING_KEY': SECRET_KEY,
})

# Test configuration
DEBUG = True
ALLOWED_HOSTS = ['*']  # Allow all hosts for testing

# Disable migrations for faster test setup
class DisableMigrations:
    def __contains__(self, item):
        return True
    def __getitem__(self, item):
        return None

MIGRATION_MODULES = DisableMigrations()

# Configure logging for tests
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'level': 'WARNING',  # Reduce noise in tests
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'WARNING',
    },
    'loggers': {
        'drf_api': {
            'handlers': ['console'],
            'level': 'WARNING',
            'propagate': False,
        },
        'django': {
            'handlers': ['console'],
            'level': 'WARNING',
            'propagate': False,
        },
    },
}

# Disable password validation for tests
AUTH_PASSWORD_VALIDATORS = []

# Speed up tests
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]

# Test email backend
EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend' 