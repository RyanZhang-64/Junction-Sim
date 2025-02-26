import pytest
from build.leftTurn import left_turn 
from build.trafficflow import traffic_volume_inputs 

#mock traffic inputs- avoids users entering values 
#makes the system fully automated
@pytest.fixture
def mock_traffic_volume_inputs(mocker):
    mocker.patch("build.leftTurn.traffic_volume_inputs", return_value=[1000, 300, 200, 500])

#unit tests 
#tests basic functions of the left tuurn 
def test_left_turn_basic(mock_traffic_volume_inputs):
    cur_vehicles = [500, 400, 300] #initial vehicles per lane
    time = 60 
    direction = "north"
    has_bus = False
    has_cycle = False

    result = left_turn(cur_vehicles, time, direction, has_bus, has_cycle)

    assert isinstance(result, list)
    assert len(result) == 3 #number of lanes should not change
    assert sum(result) == sum(cur_vehicles) #total vehicles should remain the same

#edge cases
def test_left_turn_single_lane(mock_traffic_volume_inputs):
    cur_vehicles = [500] #only one lane
    time = 60
    direction = "south"
    has_bus = False
    has_cycle = False

    result = left_turn(cur_vehicles, time, direction, has_bus, has_cycle)

    assert len(result) == 1 #only one lane should exist
    assert sum(result) == sum(cur_vehicles) #vehicles should remain the same

#test when lanes are at maximum capacity 
def test_left_turn_full_capacity(mock_traffic_volume_inputs):
    cur_vehicles = [2000, 2000, 2000]  
    time = 60
    direction = "east"
    has_bus = False
    has_cycle = False

    result = left_turn(cur_vehicles, time, direction, has_bus, has_cycle)

    assert all(veh <= 2000 for veh in result) #no lane can exceed 2000 vph

#prevent left turn when a bus lane
def test_left_turn_with_bus_lane(mock_traffic_volume_inputs):
    cur_vehicles = [500, 400, 300]
    time = 60
    direction = "west"
    has_bus = True #bus lane in use 
    has_cycle = False

    result = left_turn(cur_vehicles, time, direction, has_bus, has_cycle)

    assert result == 0 

#prevent left turn when a cycle lane 
def test_left_turn_with_cycle_lane(mock_traffic_volume_inputs):
    cur_vehicles = [500, 400, 300]
    time = 60
    direction = "north"
    has_bus = False
    has_cycle = True #cycle lane in use 

    result = left_turn(cur_vehicles, time, direction, has_bus, has_cycle)

    assert result == 0  

#performance testing 
@pytest.mark.parametrize("cur_vehicles, time, direction", [
    ([500, 400, 300], 60, "north"),
    ([1000, 800, 600, 400], 30, "south"),
    ([2000, 1500, 1000], 45, "east"),
])

#ensure left turn runs within 0.1 seconds
def test_performance_left_turn(mock_traffic_volume_inputs, cur_vehicles, time, direction):
    import time
    start_time = time.time()
    
    left_turn(cur_vehicles, time, direction, has_bus=False, has_cycle=False)
    
    duration = time.time() - start_time
    assert duration < 0.1, f"Performance issue: left_turn took {duration:.4f} sec"

#stress testing 
def test_stress_left_turn(mock_traffic_volume_inputs):
    cur_vehicles = [2000, 2000, 2000, 2000] #max capacity
    time = 60
    direction = "south"
    
    for _ in range(1000): #simulate 1000 traffic cycles
        result = left_turn(cur_vehicles, time, direction, has_bus=False, has_cycle=False)
        assert result is not None #shouldn't crash
