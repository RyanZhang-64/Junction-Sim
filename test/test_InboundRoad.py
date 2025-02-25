import pytest
from build.InboundRoad import InboundRoad  

def test_InboundRoad():
    road = InboundRoad()
    
    #test the default values
    assert road.total_standard_lanes == 1
    assert road.has_bus_lane is False
    assert road.has_left_lane is False
    assert road.priority_factor == 0

    #test the modified values
    road.total_standard_lanes = 3
    assert road.total_standard_lanes == 3

    road.has_bus_lane = True
    assert road.has_bus_lane is True

    road.has_left_lane = True
    assert road.has_left_lane is True

    road.priority_factor = 5
    assert road.priority_factor == 5

    #test negative values (should raise an error)
    with pytest.raises(ValueError):
        road.total_standard_lanes = -1

    with pytest.raises(ValueError):
        road.priority_factor = -5
