import unittest
from app import create_app, db
from app.models.customer import Customer
from app.models.racquet import Racquet
from app.models.rental import Rental
from app.services.rental_service import RentalService
from app.services.utility_service import UtilityService

class TestServices(unittest.TestCase):
    def setUp(self):
        self.app = create_app('testing')
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_rental_creation(self):
        customer = Customer(name='Jane Smith', phone='0987654321', email='jane@example.com')
        racquet1 = Racquet(serial_number='RQT67890', brand='Babolat', model='Pure Drive', condition='Good')
        racquet2 = Racquet(serial_number='RQT54321', brand='Wilson', model='Pro Staff', condition='New')
        db.session.add_all([customer, racquet1, racquet2])
        db.session.commit()

        rental = RentalService.create_rental(customer.id, 'Staff Member', [racquet1.id, racquet2.id], 50.0)
        self.assertIsNotNone(rental.id)
        self.assertEqual(len(rental.rental_racquets), 2)

    def test_inventory_stats(self):
        racquet1 = Racquet(serial_number='RQT12345', brand='Wilson', model='Pro Staff', condition='New')
        racquet2 = Racquet(serial_number='RQT67890', brand='Babolat', model='Pure Drive', condition='Good')
        db.session.add_all([racquet1, racquet2])
        db.session.commit()

        stats = UtilityService.get_inventory_stats()
        self.assertEqual(stats['total'], 2)
        self.assertEqual(stats['available'], 2)
        self.assertEqual(stats['loaned'], 0)

    # Add more service test cases here

if __name__ == '__main__':
    unittest.main()