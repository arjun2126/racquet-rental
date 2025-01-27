# app/services/barcode_service.py
from barcode.codex import Code128
from barcode.writer import ImageWriter
from io import BytesIO
import base64
import uuid

class BarcodeService:
    @staticmethod
    def generate_barcode(manufacturer_code=None):
        prefix = manufacturer_code if manufacturer_code else 'RQT'
        unique_id = str(uuid.uuid4())[:8].upper()
        barcode_number = f"{prefix}{unique_id}"
        
        buffer = BytesIO()
        Code128(barcode_number, writer=ImageWriter()).write(buffer)
        buffer.seek(0)
        
        image_base64 = base64.b64encode(buffer.getvalue()).decode()
        return {
            'barcode': barcode_number,
            'image': f'data:image/png;base64,{image_base64}'
        }