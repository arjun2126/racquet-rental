from flask import Flask
from flask_cors import CORS
from config import config
from .extensions import db

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    db.init_app(app)
    CORS(app)

    from .routes import register_blueprints
    register_blueprints(app)

    return app