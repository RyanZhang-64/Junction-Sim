import pytest
from leftTurn import left_turn

#Mock function for traffic_volume_inputs
def mock_traffic_volume_inputs(directions):
    # Example traffic volumes for test cases
    return {"north": 1000, "south": 1200, "east": 800, "west": 900}[directions[0]], \
           {"north": 1000, "south": 1200, "east": 800, "west": 900}[directions[1]], \
           {"north": 1000, "south": 1200, "east": 800, "west": 900}[directions[2]]

#Patch the function inside leftTurn.py
import leftTurn
leftTurn.traffic_volume_inputs = mock_traffic_volume_inputs

def test_left_turn_no_bus_or_cycle():
    cur_vehicles_per_lane = [300, 200, 100]  # Vehicles in 3 lanes
    time = 60  # Full traffic cycle in seconds
    direction = "north"
    has_bus = False
    has_cycle = False

    result = left_turn(cur_vehicles_per_lane, time, direction, has_bus, has_cycle)
    
    assert isinstance(result, list)
    assert len(result) == 3  # Should maintain the same number of lanes
    assert result[0] == 1000 * (60 / 60)  #Vehicles turning left
    assert sum(result) == sum(cur_vehicles_per_lane)  #Total vehicles remain the same

def test_left_turn_with_bus_lane():
    cur_vehicles_per_lane = [300, 200, 100]
    time = 60
    direction = "north"
    has_bus = True
    has_cycle = False

    result = left_turn(cur_vehicles_per_lane, time, direction, has_bus, has_cycle)
    assert result == 0  #Function should return 0 due to bus lane restriction

def test_left_turn_with_cycle_lane():
    cur_vehicles_per_lane = [300, 200, 100]
    time = 60
    direction = "north"
    has_bus = False
    has_cycle = True

    result = left_turn(cur_vehicles_per_lane, time, direction, has_bus, has_cycle)
    assert result == 0 #Function should return 0 due to cycle lane restriction

def test_left_turn_single_lane():
    cur_vehicles_per_lane = [100]  # Single lane case
    time = 60
    direction = "east"
    has_bus = False
    has_cycle = False

    result = left_turn(cur_vehicles_per_lane, time, direction, has_bus, has_cycle)
    
    assert isinstance(result, list)
    assert len(result) == 1
    assert result[0] == 800 * (60 / 60) #Since all traffic goes left

def test_left_turn_more_lanes():
    cur_vehicles_per_lane = [500, 300, 200, 100]
    time = 60
    direction = "west"
    has_bus = False
    has_cycle = False

    result = left_turn(cur_vehicles_per_lane, time, direction, has_bus, has_cycle)
    
    assert isinstance(result, list)
    assert len(result) == 4 #Same number of lanes
    assert sum(result) == sum(cur_vehicles_per_lane) #Vehicle conservation
    assert result[0] == 900 * (60 / 60) #Vehicles turning left

if __name__ == "__main__":
    pytest.main()
