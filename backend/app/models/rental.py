from datetime import datetime
import csv
from io import StringIO, BytesIO
from flask import send_file

class ExportService:
    HEADERS = [
        'Rental ID', 'Customer Name', 'Customer Phone', 'Customer Email',
        'Racquet Serial Number', 'Racquet Brand', 'Racquet Model',
        'Checkout Date', 'Expected Return Date', 'Return Date',
        'Employee Out', 'Employee Return', 'Status', 'Rental Fee'
    ]

    @classmethod
    def export_rentals_to_csv(cls, rentals):
        output = StringIO()
        writer = csv.writer(output)
        writer.writerow(cls.HEADERS)
        
        try:
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
                        rental.checkout_date.strftime('%Y-%m-%d') if rental.checkout_date else '-',
                        rental.expected_return_date.strftime('%Y-%m-%d') if rental.expected_return_date else '-',
                        rental.return_date.strftime('%Y-%m-%d') if rental.return_date else '-',
                        rental.employee_name or '-',
                        rental.returned_by or '-',
                        cls.get_rental_status(rental),
                        f"${rental.rental_fee:.2f}" if rental.rental_fee else '$0.00'
                    ])
        except Exception as e:
            print(f"Error in export_rentals_to_csv: {str(e)}")
            raise

        return BytesIO(output.getvalue().encode('utf-8'))

    @classmethod
    def get_rental_status(cls, rental):
        if rental.return_date:
            return 'Returned'
        elif rental.is_overdue:
            return 'Overdue'
        else:
            return 'Active'

    @classmethod
    def generate_filename(cls, type='active'):
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        prefix = 'rental_history' if type == 'history' else 'active_rentals'
        return f'{prefix}_{timestamp}.csv'
