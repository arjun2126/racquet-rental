from flask import Blueprint, request, jsonify
from app.models import Racquet, RentalRacquet
from app.services.barcode_service import BarcodeService
from app.extensions import db
from app.models.customer import Customer
from app.models.rental import Rental, RentalRacquet
from app.extensions import db
from app.models.racquet import Racquet
from app.models.rental import RentalRacquet
from app.services.barcode_service import BarcodeService

racquet_bp = Blueprint('racquet', __name__)

@racquet_bp.route('', methods=['GET', 'POST'])
def handle_racquets():
    if request.method == 'POST':
        try:
            data = request.json
            racquet = Racquet(
                serial_number=data['serial_number'],
                brand=data['brand'],
                model=data['model'],
                condition=data['condition'],
                manufacturer_code=data.get('manufacturer_code'),
                is_available=True
            )
            db.session.add(racquet)
            db.session.commit()
            return jsonify({
                'id': racquet.id,
                'message': 'Racquet created successfully'
            }), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400

    search = request.args.get('search', '')
    query = Racquet.query
    if search:
        query = query.filter(
            Racquet.serial_number.ilike(f'%{search}%') |
            Racquet.brand.ilike(f'%{search}%') |
            Racquet.model.ilike(f'%{search}%')
        )
    racquets = query.all()
    return jsonify([{
        'id': r.id,
        'serial_number': r.serial_number,
        'brand': r.brand,
        'model': r.model,
        'condition': r.condition,
        'manufacturer_code': r.manufacturer_code,
        'is_available': r.is_available
    } for r in racquets])

@racquet_bp.route('/stats', methods=['GET'])
def get_racquet_stats():
    try:
        total, loaned, available = Racquet.get_counts()
        return jsonify({
            'total': total,
            'loaned': loaned,
            'available': available
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@racquet_bp.route('/barcode/generate', methods=['POST'])
def generate_barcode():
    try:
        data = request.json
        result = BarcodeService.generate_barcode(data.get('manufacturer_code'))
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@racquet_bp.route('/<int:racquet_id>', methods=['PUT', 'DELETE'])
def manage_racquet(racquet_id):
    racquet = Racquet.query.get_or_404(racquet_id)
    
    if request.method == 'DELETE':
        if not racquet.is_available:
            return jsonify({'error': 'Cannot delete a currently rented racquet'}), 400
        try:
            RentalRacquet.query.filter_by(racquet_id=racquet_id).delete()
            db.session.delete(racquet)
            db.session.commit()
            return jsonify({'message': 'Racquet deleted successfully'})
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    
    try:
        data = request.json
        racquet.brand = data.get('brand', racquet.brand)
        racquet.model = data.get('model', racquet.model)
        racquet.condition = data.get('condition', racquet.condition)
        racquet.manufacturer_code = data.get('manufacturer_code', racquet.manufacturer_code)
        db.session.commit()
        return jsonify({'message': 'Racquet updated successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500