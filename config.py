import os

class Config:
    pass

    @staticmethod
    def init_app(app):
        pass

class DevelopmentConfig(Config):
    DEBUG = True
    SECRET_KEY = 'asdlfasdflkjsdf'
    REDIS_URL = 'redis://:@localhost:6379/1'
    CELERY_BROKER_URL = 'redis://:@localhost:6379/1'
    CELERY_RESULT_BACKEND = 'redis://:@localhost:6379/1'


class DeploymentConfig(Config):
    SECRET_KEY = os.environ['SECRET_KEY']
    REDIS_URL = os.environ['REDIS_URL']
    CELERY_BROKER_URL = os.environ['REDIS_URL']
    CELERY_RESULT_BACKEND = os.environ['REDIS_URL']


config = {
    'development': DevelopmentConfig,
    'deployment': DeploymentConfig
}