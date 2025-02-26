import pytest
from unittest.mock import patch
from build.trafficflow import traffic_volume_inputs, lane_configuration

#mock traffic inputs- avoids users entering values 
#makes the system fully automated 
@pytest.fixture
def mock_input(mocker):
    mocker.patch("builtins.input", side_effect=["100", "30", "30", "40"])

#test the traffic volumes 
def test_traffic_volume_inputs(mock_input):
    """Test traffic_volume_inputs() with valid and invalid cases."""
    
    #valid- match inputs
    with patch("builtins.input", side_effect=["100", "30", "30", "40"]):
        assert traffic_volume_inputs(["north", "east", "west"]) == [100, 30, 30, 40]

    #not valid- traffic can't be negative
    with patch("builtins.input", side_effect=["-50", "10", "10", "10"]):
        with pytest.raises(ValueError, match="Traffic flow cannot be negative."):
            traffic_volume_inputs(["north", "east", "west"])

    #not valid- traffic can't exit at a quicker rate
    with patch("builtins.input", side_effect=["100", "110", "20", "30"]):
        with pytest.raises(ValueError, match="Traffic cannot exit at a faster rate than it comes in."):
            traffic_volume_inputs(["north", "east", "west"])

    #not valid- traffic can't exit at a slower rate
    with patch("builtins.input", side_effect=["100", "20", "20", "50"]):
        with pytest.raises(ValueError, match="Traffic cannot exit at a slower rate than it comes in."):
            traffic_volume_inputs(["north", "east", "west"])

#test lane configurations 
def test_lane_configuration():
    """Test lane_configuration() function for valid and invalid inputs."""
    
    #valid 
    with patch("builtins.input", side_effect=["3", "1", "0", "2"]):
        assert lane_configuration("northbound") == [3, 1, 0, 2]

    #not valid- lanes not in range 
    with patch("builtins.input", side_effect=["6", "1", "0", "2"]):
        with pytest.raises(ValueError, match="Number of lanes must be between 1 and 5."):
            lane_configuration("northbound")

    #not valid- left turn must be 1 or 0
    with patch("builtins.input", side_effect=["3", "2", "0", "2"]):
        with pytest.raises(ValueError, match="Please enter 1 for a left turn lane or 0 for no left turn lane."):
            lane_configuration("northbound")

    #not valid- bus lanes must be 1 or 0
    with patch("builtins.input", side_effect=["3", "1", "2", "2"]):
        with pytest.raises(ValueError, match="Please enter 1 for a bus lane or 0 for no bus lane."):
            lane_configuration("northbound")

    #not valid- priority out of range 
    with patch("builtins.input", side_effect=["3", "1", "0", "5"]):
        with pytest.raises(ValueError, match="Please enter a priority between 0 and 4"):
            lane_configuration("northbound")
