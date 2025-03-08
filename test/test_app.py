import pytest
import logging
from flask import json
from build.app import app  # Import the Flask app

# Set up logging (Logs results into `test_logs.log`)
logging.basicConfig(filename="test_logs.log", level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

@pytest.fixture
def client():
    """Creates a test client for the Flask app."""
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

# Tests home page route
def test_home(client):
    response = client.get("/")
    assert response.status_code == 200 

# Tests edit lane selction routes 
@pytest.mark.parametrize("endpoint, expected_status", [ 
    ("/edit-northbound", 200),
    ("/edit-eastbound", 200),
    ("/edit-southbound", 200),
    ("/edit-westbound", 200)
])
def test_edit_lane(client, endpoint, expected_status):
    response = client.get(endpoint)
    assert response.status_code == expected_status  

# Tests adding a lane 
def test_add_lane(client):
    response = client.get("/add-lane")
    assert response.status_code == 200 

# Tests removing a lane 
def test_remove_lane(client):
    response = client.get("/remove-lane")
    assert response.status_code == 200

# Tests toggling a bus lane 
def test_bus_toggle(client):
    response = client.get("/bus-toggle")
    assert response.status_code == 200

# Tests toggling left lane turn 
def test_left_toggle(client):
    response = client.get("/left-toggle")
    assert response.status_code == 200
