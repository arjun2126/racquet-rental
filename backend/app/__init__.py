from flask import Flask
from flask_cors import CORS
from config import config
from .extensions import db

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    db.init_app(app)
    
    # Updated CORS configuration
    CORS(app, resources={
        r"/*": {
            "origins": [
                "https://racquet-rental-1.onrender.com",  # Your Render frontend
                "http://localhost:5173",                  # Local development
                "http://127.0.0.1:5173"                  # Alternative local
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    from .routes import register_blueprints
    register_blueprints(app)
    
    return app
