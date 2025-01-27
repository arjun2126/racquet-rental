from flask import Blueprint
from .customer_routes import customer_bp
from .racquet_routes import racquet_bp
from .rental_routes import rental_bp

def register_blueprints(app):
    app.register_blueprint(customer_bp, url_prefix='/api/customers')
    app.register_blueprint(racquet_bp, url_prefix='/api/racquets')
    app.register_blueprint(rental_bp, url_prefix='/api/rentals')
