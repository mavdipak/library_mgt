import pytest
from server.services.loans import calculate_fine
from datetime import datetime, timedelta

def test_calculate_fine_on_time():
    due = datetime.utcnow() + timedelta(days=2)
    assert calculate_fine(due) == 0

def test_calculate_fine_overdue():
    due = datetime.utcnow() - timedelta(days=3)
    fine = calculate_fine(due)
    assert fine >= 15  # 3 days * 5 (default fine per day)
