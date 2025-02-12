import pytest
from main.trafficflow import traffic_volume_inputs, lane_configuration 

def test_traffic_volume_inputs():
    #valid case
    assert traffic_volume_inputs(100, 30, 30, 40) == [100, 30, 30, 40]

    #traffic flow can't be negative
    with pytest.raises(ValueError, match="Traffic flow cannot be negative."):
        traffic_volume_inputs(-50, 10, 10, 10)

    #exiting traffic can't exceed heading traffic
    with pytest.raises(ValueError, match="Traffic cannot exit at a faster rate than it comes in."):
        traffic_volume_inputs(100, 110, 20, 30)

    #total exiting traffic must match heading traffic
    with pytest.raises(ValueError, match="Total exiting traffic must match incoming traffic."):
        traffic_volume_inputs(100, 20, 20, 50)

def test_lane_configuration():
    #valid case
    assert lane_configuration(3, 1, 0, 2) == [3, 1, 0, 2]

    #number of lanes out of range
    with pytest.raises(ValueError, match="Number of lanes must be between 1 and 5."):
        lane_configuration(6, 1, 0, 2)

    #invalid left turn lane value
    with pytest.raises(ValueError, match="Left turn lane must be 0 or 1."):
        lane_configuration(3, 2, 0, 2)

    #invalid bus lane value
    with pytest.raises(ValueError, match="Bus lane must be 0 or 1."):
        lane_configuration(3, 1, 2, 2)

    #priority out of range
    with pytest.raises(ValueError, match="Priority must be between 0 and 4."):
        lane_configuration(3, 1, 0, 5) 
