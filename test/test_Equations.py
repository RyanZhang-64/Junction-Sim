import pytest
import statistics
from equations import (
    max_queue,
    max_wait,
    average_wait,
    mean_statistic,
    fairness_statistic,
    worst_case_statistic
)

#Mock class for Junction
class MockRoad:
    def __init__(self, lanes):
        self.lanes = lanes

    def total_standard_lanes(self):
        return self.lanes

class MockJunction:
    def __init__(self, lanes_per_direction):
        self.lanes_per_direction = lanes_per_direction

    def get_road(self, direction):
        return MockRoad(self.lanes_per_direction[direction])


@pytest.fixture
def sample_junction():
    #A junction with 2 lanes in each direction (N, S, W, E)
    return MockJunction([2, 2, 2, 2])


@pytest.fixture
def vph_rates():
    #Traffic flow rate (vehicles per hour) for North, South, West, East
    return [1200, 800, 1000, 900]


def test_max_queue(vph_rates, sample_junction):
    result = max_queue(vph_rates, sample_junction, direction=0) #North direction
    assert result >= 0 #Queue can't be negative

def test_max_wait(vph_rates, sample_junction):
    result = max_wait(vph_rates, sample_junction, direction=1) #South direction
    assert result >= 0  #Wait time should be non-negative

def test_average_wait(vph_rates, sample_junction):
    result = average_wait(vph_rates, sample_junction, direction=2) #West direction
    assert result >= 0 #Average wait should be non-negative

def test_mean_statistic(vph_rates, sample_junction):
    result = mean_statistic(vph_rates, sample_junction)
    assert result >= 0 #Mean wait should be non-negative

def test_fairness_statistic(vph_rates, sample_junction):
    result = fairness_statistic(vph_rates, sample_junction)
    assert isinstance(result, float) #Fairness should be a float value
    assert result >= 0 #Variance can't be negative

def test_worst_case_statistic(vph_rates, sample_junction):
    result = worst_case_statistic(vph_rates, sample_junction)
    assert result >= 0 #Worst case should be non-negative

if __name__ == "__main__":
    pytest.main()
