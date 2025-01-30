from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify, send_file
from app.models import Rental, RentalRacquet, Racquet
from app import db
from app.extensions import db
from app.models.customer import Customer
from app.models.rental import Rental, RentalRacquet
from app.services import ExportService

rental_bp = Blueprint('rental', __name__)

@rental_bp.route('', methods=['GET', 'POST'])
def handle_rentals():
    if request.method == 'GET':
        active_rentals = Rental.query.filter_by(return_date=None).all()
        return jsonify([{
            'id': r.id,
            'customer_name': r.customer.name,
            'customer_phone': r.customer.phone,
            'racquet_serial': [rr.racquet.serial_number for rr in r.rental_racquets],
            'racquet_brand': [rr.racquet.brand for rr in r.rental_racquets],
            'racquet_model': [rr.racquet.model for rr in r.rental_racquets],
            'checkout_date': r.checkout_date.isoformat(),
            'expected_return_date': r.expected_return_date.isoformat(),
            'employee_name': r.employee_name,
            'rental_fee': r.rental_fee,
            'is_overdue': r.is_overdue
        } for r in active_rentals])

    try:
        data = request.json
        active_rentals_count = (Rental.query.join(RentalRacquet)
            .filter(Rental.customer_id == data['customer_id'])
            .filter(Rental.return_date.is_(None))
            .count())
            
        if active_rentals_count + len(data['racquet_ids']) > 3:
            return jsonify({'error': 'Customer can only rent up to 3 racquets at a time'}), 400

        local_now = datetime.now()
        rental = Rental(
            customer_id=data['customer_id'],
            employee_name=data['employee_name'],
            checkout_date=local_now,
            expected_return_date=local_now + timedelta(days=7),
            rental_fee=data['rental_fee']
        )
        db.session.add(rental)
        db.session.flush()

        for racquet_id in data['racquet_ids']:
            racquet = Racquet.query.get(racquet_id)
            if not racquet.is_available:
                db.session.rollback()
                return jsonify({'error': f'Racquet {racquet.serial_number} is not available'}), 400
            
            rental_racquet = RentalRacquet(rental_id=rental.id, racquet_id=racquet_id)
            racquet.is_available = False
            db.session.add(rental_racquet)

        db.session.commit()
        return jsonify({'id': rental.id}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@rental_bp.route('/verify-return', methods=['POST'])
def verify_return():
    try:
        data = request.json
        racquet = Racquet.query.filter_by(serial_number=data['barcode']).first()
        
        if not racquet:
            return jsonify({'error': 'Invalid barcode'}), 404
            
        if racquet.is_available:
            return jsonify({'error': 'Racquet is not currently rented'}), 400
            
        rental = (Rental.query.join(RentalRacquet)
            .filter(RentalRacquet.racquet_id == racquet.id)
            .filter(Rental.return_date.is_(None))
            .first())
            
        if not rental:
            return jsonify({'error': 'No active rental found for this racquet'}), 404
            
        return jsonify({
            'rental': {
                'id': rental.id,
                'customer_name': rental.customer.name,
                'checkout_date': rental.checkout_date.isoformat(),
                'racquet_details': {
                    'brand': racquet.brand,
                    'model': racquet.model,
                    'condition_at_checkout': racquet.condition
                }
            }
        })
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@rental_bp.route('/<int:rental_id>/complete-return', methods=['POST'])
def complete_return(rental_id):
    try:
        data = request.json
        rental = Rental.query.get_or_404(rental_id)
        
        for rental_racquet in rental.rental_racquets:
            racquet = rental_racquet.racquet
            racquet.condition = data['new_condition']
            racquet.is_available = True
            
        rental.return_date = datetime.utcnow()
        rental.returned_by = data['employee_name']
        
        db.session.commit()
        return jsonify({'message': 'Return processed successfully'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@rental_bp.route('/history', methods=['GET'])
def get_rental_history():
    try:
        rentals = Rental.query.order_by(Rental.checkout_date.desc()).all()
        rental_history = []
        for rental in rentals:
            customer = rental.customer
            for rental_racquet in rental.rental_racquets:
                racquet = rental_racquet.racquet
                rental_history.append({
                    'id': rental.id,
                    'customer_name': customer.name,
                    'customer_phone': customer.phone,
                    'racquet_serial': racquet.serial_number,
                    'racquet_brand': racquet.brand,
                    'racquet_model': racquet.model,
                    'checkout_date': rental.checkout_date.isoformat(),
                    'expected_return_date': rental.expected_return_date.isoformat(),
                    'return_date': rental.return_date.isoformat() if rental.return_date else None,
                    'rental_fee': rental.rental_fee,
                    'status': 'Returned' if rental.return_date else ('Overdue' if rental.is_overdue else 'Active'),
                    'employee_out': rental.employee_name,
                    'employee_return': rental.returned_by
                })
        return jsonify(rental_history)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
        
@rental_bp.route('/export', methods=['GET'])
def export_rentals():
    try:
        # Get the type from query parameter, default to 'active'
        export_type = request.args.get('type', 'active')
        
        if export_type == 'history':
            # Get all rentals including completed ones
            rentals = Rental.query.all()
        else:
            # Get only active rentals
            rentals = Rental.query.filter_by(return_date=None).all()
        
        csv_buffer = ExportService.export_rentals_to_csv(rentals)
        filename = ExportService.generate_filename(export_type)
        
        return send_file(
            csv_buffer,
            mimetype='text/csv',
            as_attachment=True,
            download_name=filename
        )
    except Exception as e:
        print(f"Error in export_rentals: {str(e)}")
        return jsonify({'error': str(e)}), 500
