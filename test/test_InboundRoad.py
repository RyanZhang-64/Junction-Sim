import pytest
import time
from build.InboundRoad import InboundRoad  

#unit tests
def test_InboundRoad_defaults():
    road = InboundRoad()
    
    #test default values
    assert road.get_num_lanes() == 1
    assert road.has_bus_lane is False
    assert road.has_left_lane is False
    assert road.priority_factor == 1  

def test_modify_values():
    road = InboundRoad()

    #modify attributes and check
    road.set_total_standard_lanes(3)
    assert road.get_num_lanes() == 3

    road.set_has_bus_lane(True)
    assert road.has_bus_lane is True

    road.set_has_left_lane(True)
    assert road.has_left_lane is True

    road.set_priority_factor(5)
    assert road.priority_factor == 5

#edge cases (boundary testing)
def test_lane_limits():
    road = InboundRoad()

    #try going over the maximum number of lanes
    road.set_total_standard_lanes(5)
    road.increment_num_lanes()  #should not increase beyond 5
    assert road.get_num_lanes() == 5  

    #try going below the minimum number of lanes
    road.set_total_standard_lanes(1)
    road.decrement_num_lanes()  #should not decrease below 1
    assert road.get_num_lanes() == 1  

#toggle bus lane and check
def test_toggle_bus_lane():
    road = InboundRoad()

    road.toggle_bus_lane()
    assert road.has_bus_lane is True

    road.toggle_bus_lane()
    assert road.has_bus_lane is False

#toggle left lane and check
def test_toggle_left_lane():
    road = InboundRoad()

    road.toggle_left_lane()
    assert road.has_left_lane is True

    road.toggle_left_lane()
    assert road.has_left_lane is False

#negative tests (should raise errors)
def test_invalid_lane_count():
    road = InboundRoad()

    # ValueError for negative lanes
    with pytest.raises(ValueError):
        road.set_total_standard_lanes(-1)

def test_invalid_priority():
    road = InboundRoad()

    #ValueError for negative priority factor
    with pytest.raises(ValueError):
        road.set_priority_factor(-5)

#performance test 
@pytest.mark.parametrize("func, args", [
    (road.increment_num_lanes, ()),
    (road.decrement_num_lanes, ()),
    (road.toggle_bus_lane, ()),
    (road.toggle_left_lane, ()),
    (road.get_num_lanes, ()),
    (road.set_total_standard_lanes, (3,)),
    (road.set_has_bus_lane, (True,)),
    (road.set_has_left_lane, (True,)),
    (road.set_priority_factor, (4,))
])
def test_performance(func, args):
    start_time = time.time()
    func(*args)
    duration = time.time() - start_time
    assert duration < 0.1, f"Performance issue: {func.__name__} took {duration:.4f} sec"

#stress test (simulate high number of function calls)
def test_stress_toggle_lanes():
    road = InboundRoad()

    for _ in range(100):  # Toggle lane 100 times
        road.toggle_bus_lane()
        road.toggle_left_lane()

    assert road.has_bus_lane is False  #should be back to original state
    assert road.has_left_lane is False  # sould be back to original state

