import os


class Config:
    pass

    @staticmethod
    def init_app(app):
        pass

class DevelopmentConfig(Config):
    DEBUG = True
    SECRET_KEY = 'asdlfasdflkjsdf'
    REDIS_URL = 'redis://:@localhost:6379/0'
    CELERY_BROKER_URL = 'redis://:@localhost:6379/0'
    CELERY_RESULT_BACKEND = 'redis://:@localhost:6379/0'


class DeploymentConfig(Config):
    SECRET_KEY = os.environ.get('SECRET_KEY')
    REDIS_URL = os.environ.get('REDIS_URL')
    CELERY_BROKER_URL = os.environ.get('REDIS_URL')
    CELERY_RESULT_BACKEND = os.environ.get('REDIS_URL')


config = {
    'development': DevelopmentConfig,
    'deployment': DeploymentConfig
}