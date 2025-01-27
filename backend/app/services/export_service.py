from datetime import datetime
import csv
from io import StringIO, BytesIO
from flask import send_file

class ExportService:
    HEADERS = [
        'Rental ID', 'Customer Name', 'Customer Phone', 'Customer Email',
        'Racquet Serial Number', 'Racquet Brand', 'Racquet Model',
        'Checkout Date', 'Expected Return Date', 'Status', 'Rental Fee'
    ]

    @classmethod
    def export_rentals_to_csv(cls, rentals):
        output = StringIO()
        writer = csv.writer(output)
        writer.writerow(cls.HEADERS)
        
        for rental in rentals:
            customer = rental.customer
            for rental_racquet in rental.rental_racquets:
                racquet = rental_racquet.racquet
                writer.writerow([
                    rental.id,
                    customer.name,
                    customer.phone,
                    customer.email,
                    racquet.serial_number,
                    racquet.brand,
                    racquet.model,
                    rental.checkout_date.strftime('%Y-%m-%d'),
                    rental.expected_return_date.strftime('%Y-%m-%d'),
                    'Overdue' if rental.is_overdue else 'Active',
                    rental.rental_fee
                ])
        
        return BytesIO(output.getvalue().encode('utf-8'))

    @classmethod
    def generate_filename(cls):
        return f'active_rentals_{datetime.now().strftime("%Y%m%d")}.csv'