import pytest
import time
import statistics
import numpy
import logging

# Importing functions from equations.py
from build.Equations import (
    get_efficiency_score,
    get_green_proportion,
    max_queue,
    max_wait,
    environmental_score,
    average_wait,
    mean_statistic,
    fairness_statistic,
    worst_case_statistic
)
from build.Junction import Junction  

# Set up logging (Logs results into `test_logs.log`)
logging.basicConfig(filename="test_logs.log", level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Mock junction for unit tests- mimics a single road at a junction
@pytest.fixture
def mock_junction():
    class MockRoad:
        def __init__(self, priority, lanes):
            self._priority_factor = priority
            self._total_standard_lanes = lanes

        def priority_factor(self):
            return self._priority_factor

        def total_standard_lanes(self):
            return self._total_standard_lanes

    class MockJunction:
        def __init__(self):
            self.roads = {
                "north": MockRoad(1, 2),
                "south": MockRoad(2, 2),
                "east": MockRoad(1, 3),
                "west": MockRoad(1, 1),
            }
            self.puffin_crossings = False

        def get_road(self, direction):
            return self.roads[direction]

        def get_all_roads(self):
            return list(self.roads.values())

    return MockJunction()

# Defines normal test values
test_vph_rates = [800, 1200, 600, 400]


# Unit tests 
# Tests green light proportions- higher priority should get more green light
def test_get_green_proportion(mock_junction):
    assert get_green_proportion(mock_junction, "north") > 0
    assert get_green_proportion(mock_junction, "south") > get_green_proportion(mock_junction, "west")

# Ensures queue size is not negative 
def test_max_queue(mock_junction):
    assert max_queue(test_vph_rates, mock_junction, "north") >= 0

# Valid wait time (not negative)
def test_max_wait(mock_junction):
    assert max_wait(test_vph_rates, mock_junction, "north") >= 0

# Valid average wait time (not negative)
def test_average_wait(mock_junction):
    assert average_wait(test_vph_rates, mock_junction, "north") >= 0

# Mean wait time is not negative
def test_mean_statistic(mock_junction):
    assert mean_statistic(test_vph_rates, mock_junction) > 0

# Traffic flow fairness is not negative 
def test_fairness_statistic(mock_junction):
    assert fairness_statistic(test_vph_rates, mock_junction) >= 0

# Worst case is not negative
def test_worst_case_statistic(mock_junction):
    assert worst_case_statistic(test_vph_rates, mock_junction) > 0

# Test environmental score
def test_environmental_score():
    assert environmental_score(False, False, False) == 100
    assert environmental_score(True, False, False) == 50 # Bike lane reduces score
    assert environmental_score(False, True, False) == 60 # Bus lane reduces score
    assert environmental_score(False, False, True) == 90 # Puffind crossing reduces score 

# Performance tests 
# Ensures functions execute in under 0.1s
@pytest.mark.parametrize("func, args", [
    (get_efficiency_score, (test_vph_rates, mock_junction())),
    (get_green_proportion, (mock_junction(), "north")),
    (max_queue, (test_vph_rates, mock_junction(), "north")),
    (max_wait, (test_vph_rates, mock_junction(), "north")),
    (average_wait, (test_vph_rates, mock_junction(), "north")),
    (mean_statistic, (test_vph_rates, mock_junction())),
    (fairness_statistic, (test_vph_rates, mock_junction())),
    (worst_case_statistic, (test_vph_rates, mock_junction()))
])
def test_performance(func, args):
    start_time = time.time()
    func(*args)  # Call the function
    duration = time.time() - start_time
    assert duration < 0.1, f"Performance issue: {func.__name__} took {duration:.4f} sec"


# Stress tests- simulates maximum allowed traffic volumes
# Checks queue size is valid 
def test_stress_max_queue(mock_junction):
    large_vph_rates = [2000, 2000, 2000, 2000]  
    result = max_queue(large_vph_rates, mock_junction, "north")
    assert result >= 0, "Stress test failed: max_queue returned negative queue size"

# Ensures max wait doesn't return a negative value
def test_stress_max_wait(mock_junction):
    large_vph_rates = [2000, 2000, 2000, 2000]
    result = max_wait(large_vph_rates, mock_junction, "north")
    assert result >= 0, "Stress test failed: max_wait returned negative wait time"

# Checks a valid efficeny score is always produced
def test_stress_efficiency_score(mock_junction):
    large_vph_rates = [20000, 2000, 2000, 2000]
    result = get_efficiency_score(large_vph_rates, mock_junction)
    assert result >= 0, "Stress test failed: efficiency score is negative"

