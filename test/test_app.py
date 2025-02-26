import pytest
from flask import json
from build.app import app  # Import the Flask app

@pytest.fixture
def client():
    """Creates a test client for the Flask app."""
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

#tests home page route
def test_home(client):
    response = client.get("/")
    assert response.status_code == 200 

#tests edit lane selction routes 
@pytest.mark.parametrize("endpoint, expected_status", [ 
    ("/edit-northbound", 204),
    ("/edit-eastbound", 204),
    ("/edit-southbound", 204),
    ("/edit-westbound", 204)
])
def test_edit_lane(client, endpoint, expected_status):
    response = client.get(endpoint)
    assert response.status_code == expected_status  # Should return 204 (No Content)

#tests adding a lane 
def test_add_lane(client):
    response = client.get("/add-lane")
    assert response.status_code == 204 

#tests removing a lane 
def test_remove_lane(client):
    response = client.get("/remove-lane")
    assert response.status_code == 204 

#tests toggling a bus lane 
def test_bus_toggle(client):
    response = client.get("/bus-toggle")
    assert response.status_code == 204  

#tests toggling left lane turn 
def test_left_toggle(client):
    response = client.get("/left-toggle")
    assert response.status_code == 204  
