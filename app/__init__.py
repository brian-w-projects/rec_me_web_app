from flask import Flask
from flask_moment import Moment
from flask_redis import FlaskRedis
from flask_celery import Celery
from flask_sslify import SSLify

from config import config

moment = Moment()
redis_store = FlaskRedis()
celery = Celery()


def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    moment.init_app(app)
    redis_store.init_app(app)
    celery.init_app(app)

    sslify = SSLify(app)

    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app