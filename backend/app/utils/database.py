from app import db
from contextlib import contextmanager

@contextmanager
def db_transaction():
    """Context manager for database transactions."""
    try:
        yield
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        raise e

def init_db():
    """Initialize database and create tables."""
    db.create_all()

def drop_db():
    """Drop all database tables."""
    db.drop_all()