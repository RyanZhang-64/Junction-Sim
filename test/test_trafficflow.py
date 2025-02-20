import pytest
from main.traffic import traffic_volume_inputs, lane_configuration  # Adjust import path if needed

def test_traffic_volume_inputs():
    #Valid case
    assert traffic_volume_inputs(100, 30, 30, 40) == [100, 30, 30, 40]

    #Traffic flow can't be negative
    with pytest.raises(ValueError, match="Traffic flow cannot be negative."):
        traffic_volume_inputs(-50, 10, 10, 10)

    #Exiting traffic can't exceed heading traffic
    with pytest.raises(ValueError, match="Traffic cannot exit at a faster rate than it comes in."):
        traffic_volume_inputs(100, 110, 20, 30)

    #Total exiting traffic must match heading traffic
    with pytest.raises(ValueError, match="Total exiting traffic must match incoming traffic."):
        traffic_volume_inputs(100, 20, 20, 50)

def test_lane_configuration():
    #Valid case
    assert lane_configuration(3, 1, 0, 2) == [3, 1, 0, 2]

    #Number of lanes is out of range
    with pytest.raises(ValueError, match="Number of lanes must be between 1 and 5."):
        lane_configuration(6, 1, 0, 2)

    #Invalid left turn value
    with pytest.raises(ValueError, match="Left turn lane must be 0 or 1."):
        lane_configuration(3, 2, 0, 2)

    #Invalid bus lane value
    with pytest.raises(ValueError, match="Bus lane must be 0 or 1."):
        lane_configuration(3, 1, 2, 2)

    #Priority out of range
    with pytest.raises(ValueError, match="Priority must be between 0 and 4."):
        lane_configuration(3, 1, 0, 5)
