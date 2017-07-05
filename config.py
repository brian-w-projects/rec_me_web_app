import os

class Config:
    REDIS_URL = 'redis://:@localhost:6379/0'
    CELERY_BROKER_URL = 'redis://:@localhost:6379/0'
    CELERY_RESULT_BACKEND = 'redis://:@localhost:6379/0'

    @staticmethod
    def init_app(app):
        pass

class DevelopmentConfig(Config):
    DEBUG = True
    SECRET_KEY = 'asdlfasdflkjsdf'


class DeploymentConfig(Config):
    SECRET_KEY = os.environ['SECRET_KEY']


config = {
    'development': DevelopmentConfig,
    'deployment': DeploymentConfig
}