# app/models/rental.py
from datetime import datetime
from ..extensions import db

class Rental(db.Model):
    __tablename__ = 'rental'
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    customer = db.relationship('Customer', back_populates='rentals')
    checkout_date = db.Column(db.DateTime, default=datetime.utcnow)
    return_date = db.Column(db.DateTime)
    returned_by = db.Column(db.String(100))
    employee_name = db.Column(db.String(100))
    expected_return_date = db.Column(db.DateTime)
    rental_fee = db.Column(db.Float)
    rental_racquets = db.relationship('RentalRacquet', backref='rental', lazy=True)

    @property
    def is_overdue(self):
        return (not self.return_date and
                datetime.utcnow() > self.expected_return_date) if self.expected_return_date else False

class RentalRacquet(db.Model):
    __tablename__ = 'rental_racquet'
    id = db.Column(db.Integer, primary_key=True)
    rental_id = db.Column(db.Integer, db.ForeignKey('rental.id'), nullable=False)
    racquet_id = db.Column(db.Integer, db.ForeignKey('racquet.id'), nullable=False)