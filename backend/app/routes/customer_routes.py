from flask import Blueprint, request, jsonify
from app.models import Customer, Rental, RentalRacquet
from app import db
from app.extensions import db
from app.models.customer import Customer
from app.models.rental import Rental, RentalRacquet

customer_bp = Blueprint('customer', __name__)

@customer_bp.route('', methods=['GET', 'POST'])
def handle_customers():
    if request.method == 'POST':
        try:
            data = request.json
            customer = Customer(
                name=data['name'],
                phone=data['phone'],
                email=data.get('email')
            )
            db.session.add(customer)
            db.session.commit()
            return jsonify({
                'id': customer.id,
                'name': customer.name,
                'phone': customer.phone,
                'email': customer.email
            }), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400

    search = request.args.get('search', '')
    query = Customer.query
    if search:
        query = query.filter(
            Customer.name.ilike(f'%{search}%') |
            Customer.phone.ilike(f'%{search}%') |
            Customer.email.ilike(f'%{search}%')
        )
    customers = query.all()
    return jsonify([{
        'id': c.id,
        'name': c.name,
        'phone': c.phone,
        'email': c.email
    } for c in customers])

@customer_bp.route('/<int:customer_id>', methods=['DELETE'])
def delete_customer(customer_id):
    try:
        customer = Customer.query.get_or_404(customer_id)
        for rental in customer.rentals:
            RentalRacquet.query.filter_by(rental_id=rental.id).delete()
        db.session.delete(customer)
        db.session.commit()
        return jsonify({'message': 'Customer deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@customer_bp.route('/<int:customer_id>/rentals', methods=['GET'])
def get_customer_rentals(customer_id):
    try:
        rentals = Rental.query.filter_by(customer_id=customer_id).all()
        return jsonify([{
            'id': r.id,
            'racquet_serial': [rr.racquet.serial_number for rr in r.rental_racquets],
            'checkout_date': r.checkout_date.isoformat(),
            'return_date': r.return_date.isoformat() if r.return_date else None,
            'rental_fee': r.rental_fee
        } for r in rentals])
    except Exception as e:
        return jsonify({'error': str(e)}), 500