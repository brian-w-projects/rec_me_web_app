import os

class Config:
    # SECRET_KEY = os.environ['SECRET_KEY']
    SECRET_KEY = 'asdlfasdflkjsdf'

    @staticmethod
    def init_app(app):
        pass

class DevelopmentConfig(Config):
    DEBUG = True
    REDIS_URL = 'redis://:@localhost:6379/0'
    CELERY_BROKER_URL = 'redis://:@localhost:6379/0'
    CELERY_RESULT_BACKEND = 'redis://:@localhost:6379/0'

config = {
    'development': DevelopmentConfig
}