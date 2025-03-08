import pytest
import time
import logging
from build.Junction import Junction  
from build.InboundRoad import InboundRoad  
from build.Equations import get_efficiency_score  

# Set up logging (Logs results into `test_logs.log`)
logging.basicConfig(filename="test_logs.log", level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Unit Test
def test_Junction_defaults():
    junction = Junction()

    # Junction should initialise with 4 inbound roads
    assert len(junction.get_all_roads()) == 4
    assert isinstance(junction.get_road(0), InboundRoad)
    assert junction.puffin_crossings is False  # Default
    
    # Check default metric values
    assert junction.mean_wait_secs == 0
    assert junction.mean_wait_mins == 0
    assert junction.max_wait_mins == 0
    assert junction.max_wait_secs == 0
    assert junction.max_queue == 0
    assert junction.performance == 0
    assert junction.environment == 0

# Test efficiency score calculation
def test_efficiency_score():
    junction = Junction()
    vph_rates = [1000, 1200, 800, 600]

    # Ensure the efficiency score calculation
    score = junction.get_efficiency_score(vph_rates)  
    assert isinstance(score, (int, float)) and score >= 0  # Must be a numerical score

# Test getting roads by index
def test_get_road():
    junction = Junction()

    # Ensure `get_road()` returns the correct `InboundRoad` instance
    road_1 = junction.get_road(1)
    road_2 = junction.get_road(2)
    assert isinstance(road_1, InboundRoad)
    assert isinstance(road_2, InboundRoad)
    assert road_1 is not road_2  # Ensure they are distinct objects

# Edge Case- Invalid Road Index
def test_get_road_invalid_index():
    junction = Junction()

    # Accessing an invalid 
    with pytest.raises(IndexError):
        junction.get_road(5)  # Index out of range

    with pytest.raises(IndexError):
        junction.get_road(-1)  # Negative index

def test_get_vph_rates():
    junction = Junction()
    junction.get_road(0).vph_rate = 1000
    junction.get_road(1).vph_rate = 1200
    junction.get_road(2).vph_rate = 800
    junction.get_road(3).vph_rate = 600

    expected_rates = [1000, 1200, 800, 600]
    assert junction.get_vph_rates() == expected_rates  # Ensure correct VPH rates

def test_update_junction_metrics():
    junction = Junction()

    # Manually set VPH rates
    junction.get_road(0).vph_rate = 1000
    junction.get_road(1).vph_rate = 1200
    junction.get_road(2).vph_rate = 800
    junction.get_road(3).vph_rate = 600

    # Run the update method
    junction.update_junction_metrics()

    # Check updated values (not 0 anymore)
    assert junction.mean_wait_secs >= 0
    assert junction.mean_wait_mins >= 0
    assert junction.max_wait_mins >= 0
    assert junction.max_wait_secs >= 0
    assert junction.max_queue >= 0
    assert junction.performance >= 0
    assert junction.environment >= 0

# Stress Test- Efficiency Score with Max Traffic
def test_stress_efficiency_score():
    junction = Junction()
    large_vph_rates = [2000, 2000, 2000, 2000]  # Max traffic values

    score = junction.get_efficiency_score(large_vph_rates)
    assert score >= 0, "Stress test failed: Efficiency score is negative"

# Stress Test
def test_stress_get_all_roads():
    junction = Junction()

    # Call 1000 times to test performance
    for _ in range(1000):
        roads = junction.get_all_roads()
        assert len(roads) == 4  # Should always return 4 roads
