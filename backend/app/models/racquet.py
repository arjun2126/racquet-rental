from datetime import datetime
from ..extensions import db

class Racquet(db.Model):
    __tablename__ = 'racquet'
    id = db.Column(db.Integer, primary_key=True)
    serial_number = db.Column(db.String(50), unique=True, nullable=False)
    brand = db.Column(db.String(50), nullable=False)
    model = db.Column(db.String(50), nullable=False)
    condition = db.Column(db.String(20), nullable=False)
    manufacturer_code = db.Column(db.String(50))
    is_available = db.Column(db.Boolean, default=True)
    purchase_date = db.Column(db.DateTime, default=datetime.utcnow)
    last_maintenance = db.Column(db.DateTime)
    rental_racquets = db.relationship('RentalRacquet', backref='racquet', lazy=True)

    @staticmethod
    def get_counts():
        total = Racquet.query.count()
        loaned = Racquet.query.filter_by(is_available=False).count()
        available = Racquet.query.filter_by(is_available=True).count()
        return total, loaned, available