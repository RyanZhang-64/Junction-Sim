import pytest
import logging
from unittest.mock import patch
from build.trafficflow import traffic_volume_inputs, lane_configuration

#set up logging (Logs results into `test_logs.log`)
logging.basicConfig(filename="test_logs.log", level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Test traffic volume inputs
def test_traffic_volume_inputs():
    """Test traffic_volume_inputs() with valid and invalid cases."""

    # Valid case: Inputs match expected output
    with patch("builtins.input", side_effect=["100", "30", "30", "40", "y"]):
        assert traffic_volume_inputs(["north", "east", "west"]) == [100, 30, 30, 40]

    # Invalid case: Traffic flow cannot be negative
    with patch("builtins.input", side_effect=["-50", "10", "10", "10", "y"]):
        result = traffic_volume_inputs(["north", "east", "west"])
        assert result is None or result[0] >= 0  # Ensures negative values aren't processed

    # Invalid case: Exiting traffic cannot exceed incoming traffic
    with patch("builtins.input", side_effect=["100", "110", "20", "30", "y"]):
        result = traffic_volume_inputs(["north", "east", "west"])
        assert result is None or sum(result[1:]) <= result[0]  # Ensure exits don't exceed incoming traffic

    # Invalid case: Exiting traffic must match incoming traffic
    with patch("builtins.input", side_effect=["100", "20", "20", "50", "y"]):
        result = traffic_volume_inputs(["north", "east", "west"])
        assert result is None or sum(result[1:]) == result[0]  # Ensure exits match incoming traffic

    # User declines confirmation, re-enters values
    with patch("builtins.input", side_effect=["100", "30", "30", "40", "n", "100", "30", "30", "40", "y"]):
        assert traffic_volume_inputs(["north", "east", "west"]) == [100, 30, 30, 40]

# Test lane configuration
def test_lane_configuration():
    """Test lane_configuration() function for valid and invalid inputs."""

    # Valid case
    with patch("builtins.input", side_effect=["3", "1", "0", "2", "y"]):
        assert lane_configuration("northbound") == [3, 1, 0, 2]

    # Invalid case: Number of lanes must be between 1 and 5
    with patch("builtins.input", side_effect=["6", "1", "0", "2", "y"]):
        result = lane_configuration("northbound")
        assert result[0] in range(1, 6)  # Ensure lane count is within 1-5

    # Invalid case: Left turn lane must be 0 or 1
    with patch("builtins.input", side_effect=["3", "2", "0", "2", "y"]):
        result = lane_configuration("northbound")
        assert result[1] in [0, 1]  # Ensure left turn lane is either 0 or 1

    # Invalid case: Bus lane must be 0 or 1
    with patch("builtins.input", side_effect=["3", "1", "2", "2", "y"]):
        result = lane_configuration("northbound")
        assert result[2] in [0, 1]  # Ensure bus lane is either 0 or 1

    # Invalid case: Priority must be between 0 and 4
    with patch("builtins.input", side_effect=["3", "1", "0", "5", "y"]):
        result = lane_configuration("northbound")
        assert result[3] in range(0, 5)  # Ensure priority is within valid range

    # User declines confirmation, re-enters values
    with patch("builtins.input", side_effect=["3", "1", "0", "2", "n", "3", "1", "0", "2", "y"]):
        assert lane_configuration("northbound") == [3, 1, 0, 2]
