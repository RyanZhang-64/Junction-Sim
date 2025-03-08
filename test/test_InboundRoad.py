import pytest
import logging
import time
import math
from build.InboundRoad import InboundRoad  

# Set up logging (Logs results into `test_logs.log`)
logging.basicConfig(filename="test_logs.log", level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Unit tests
def test_InboundRoad_defaults():
    road = InboundRoad()
    
    # Test default values
    assert road.get_num_lanes() == 1
    assert road.has_bus_lane is False
    assert road.has_left_lane is False
    assert road.has_bike_lane is False
    assert road.puffin_crossing is False
    assert road.priority_factor == 1
    assert road.vph_rate == 100

# Test modifying values
def test_modify_values():
    road = InboundRoad()

    # Modify attributes and check
    road.set_total_standard_lanes(3)
    assert road.get_num_lanes() == 3

    road.set_has_bus_lane(True)
    assert road.has_bus_lane is True

    road.set_has_left_lane(True)
    assert road.has_left_lane is True

    road.set_priority_factor(5)
    assert road.priority_factor == 5

# Test lane limits (Boundary Testing)
def test_lane_limits():
    road = InboundRoad()

    # Try going over the maximum number of lanes
    road.set_total_standard_lanes(5)
    road.increment_num_lanes()  # Should not increase beyond 5
    assert road.get_num_lanes() == 5  

    # Try going below the minimum number of lanes
    road.set_total_standard_lanes(1)
    road.decrement_num_lanes()  # Should not decrease below 1
    assert road.get_num_lanes() == 1  

# Toggle bus lane and check
def test_toggle_bus_lane():
    road = InboundRoad()

    road.toggle_bus_lane()
    assert road.has_bus_lane is True
    assert road.has_bike_lane is False
    assert road.has_left_lane is False

    road.toggle_bus_lane()
    assert road.has_bus_lane is False

# Toggle left lane and check
def test_toggle_left_lane():
    road = InboundRoad()

    road.toggle_left_lane()
    assert road.has_left_lane is True
    assert road.has_bike_lane is False
    assert road.has_bus_lane is False

    road.toggle_left_lane()
    assert road.has_left_lane is False

# Toggle bike lane and check
def test_toggle_bike_lane():
    road = InboundRoad()

    road.toggle_bike_lane()
    assert road.has_bike_lane is True
    assert road.has_left_lane is False
    assert road.has_bus_lane is False

    road.toggle_bike_lane()
    assert road.has_bike_lane is False

# Toggle puffin crossing and check
def test_toggle_puffin_crossing():
    road = InboundRoad()

    road.toggle_puffin_crossing()
    assert road.puffin_crossing is True

    road.toggle_puffin_crossing()
    assert road.puffin_crossing is False

# Negative tests (should raise errors)
def test_invalid_lane_count():
    road = InboundRoad()

    # ValueError for negative lanes
    with pytest.raises(ValueError):
        road.set_total_standard_lanes(-1)

def test_invalid_priority():
    road = InboundRoad()

    # ValueError for negative priority factor
    with pytest.raises(ValueError):
        road.set_priority_factor(-5)

# Test Metrics Methods
def test_metrics_methods():
    road = InboundRoad()

    # Check if all values are returned in the list
    assert isinstance(road.get_metrics_as_array(), list)
    assert isinstance(road.get_configuration_as_array(), list)
    assert len(road.get_metrics_as_array()) == 7  # 7 metrics values
    assert len(road.get_configuration_as_array()) == 7  # 7 configuration values

# Stress test (simulate high number of function calls)
def test_stress_toggle_lanes():
    road = InboundRoad()

    for _ in range(100):  # Toggle lanes 100 times
        road.toggle_bus_lane()
        road.toggle_left_lane()
        road.toggle_bike_lane()

    assert road.has_bus_lane is False  # Should be back to original state
    assert road.has_left_lane is False  # Should be back to original state
    assert road.has_bike_lane is False  # Should be back to original state
