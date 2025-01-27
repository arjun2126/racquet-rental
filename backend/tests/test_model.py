import unittest
from app import create_app, db
from app.models.customer import Customer
from app.models.racquet import Racquet
from app.models.rental import Rental

class TestModels(unittest.TestCase):
    def setUp(self):
        """Set up test environment"""
        self.app = create_app('testing')
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        """Clean up test environment"""
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_customer_creation(self):
        """Test customer model creation"""
        customer = Customer(
            name='John Doe',
            phone='1234567890',
            email='john@example.com'
        )
        db.session.add(customer)
        db.session.commit()

        self.assertIsNotNone(customer.id)
        self.assertEqual(customer.name, 'John Doe')

    def test_racquet_creation(self):
        """Test racquet model creation"""
        racquet = Racquet(
            serial_number='RQT12345',
            brand='Wilson',
            model='Pro Staff',
            condition='New',
            is_available=True
        )
        db.session.add(racquet)
        db.session.commit()

        self.assertIsNotNone(racquet.id)
        self.assertTrue(racquet.is_available)

    def test_rental_creation(self):
        """Test rental model creation"""
        customer = Customer(
            name='Jane Smith',
            phone='0987654321',
            email='jane@example.com'
        )
        racquet = Racquet(
            serial_number='RQT67890',
            brand='Babolat',
            model='Pure Drive',
            condition='Good',
            is_available=True
        )
        db.session.add(customer)
        db.session.add(racquet)
        db.session.flush()

        rental = Rental(
            customer_id=customer.id,
            employee_name='Staff Member',
            rental_fee=25.0
        )
        db.session.add(rental)
        db.session.commit()

        self.assertIsNotNone(rental.id)
        self.assertEqual(rental.customer, customer)

    def test_email_validation(self):
        """Test email validation"""
        with self.assertRaises(ValueError):
            Customer(
                name='Invalid Email',
                phone='1234567890',
                email='invalid-email'
            )

    def test_rental_overdue(self):
        """Test rental overdue property"""
        # More complex test would involve setting specific dates
        pass

if __name__ == '__main__':
    unittest.main()