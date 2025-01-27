import unittest
from flask import json
from app import create_app, db
from app.models.customer import Customer
from app.models.racquet import Racquet
from app.models.rental import Rental

class TestRoutes(unittest.TestCase):
    def setUp(self):
        self.app = create_app('testing')
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()
        self.client = self.app.test_client()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_customer_create(self):
        data = {
            'name': 'John Doe',
            'phone': '1234567890',
            'email': 'john@example.com'
        }
        response = self.client.post('/api/customers', data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_racquet_create(self):
        data = {
            'serial_number': 'RQT12345',
            'brand': 'Wilson',
            'model': 'Pro Staff',
            'condition': 'New'
        }
        response = self.client.post('/api/racquets', data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 201)

    # Add more route test cases here

if __name__ == '__main__':
    unittest.main()