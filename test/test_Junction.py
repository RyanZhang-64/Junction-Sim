import pytest
import time
import logging
from build.Junction import Junction  
from build.InboundRoad import InboundRoad  
from build.Equations import get_efficiency_score  

#set up logging (Logs results into `test_logs.log`)
logging.basicConfig(filename="test_logs.log", level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

#unit test 
def test_Junction_defaults():
    junction = Junction()

    #junction should initialise with 4 inbound roads
    assert len(junction.get_all_roads()) == 4
    assert isinstance(junction.get_road(0), InboundRoad)
    assert junction.puffin_crossings is False #default

def test_efficiency_score():
    junction = Junction()
    vph_rates = [1000, 1200, 800, 600]

    #ensure the efficiency score calculation 
    score = junction.efficiency_score(vph_rates)
    assert isinstance(score, (int, float)) and score >= 0 #must be a numerical score

def test_get_road():
    junction = Junction()

    #ensures get_road returns the correct InboundRoad instance
    road_1 = junction.get_road(1)
    road_2 = junction.get_road(2)
    assert isinstance(road_1, InboundRoad)
    assert isinstance(road_2, InboundRoad)
    assert road_1 is not road_2 #ensure they are distinct 

#edge cases
def test_get_road_invalid_index():
    junction = Junction()

    #accessing an invalid index raises an error
    with pytest.raises(IndexError):
        junction.get_road(5) #index out of range 

    with pytest.raises(IndexError):
        junction.get_road(-1) #negative index

#stress test 
def test_stress_efficiency_score():
    junction = Junction()
    large_vph_rates = [2000, 2000, 2000, 2000] #max traffic values in all directions

    score = junction.efficiency_score(large_vph_rates)
    assert score >= 0, "Stress test failed: Efficiency score is negative"

def test_stress_get_all_roads():
    junction = Junction()

    #call get_all_roads 1000 times to test the performance under high load
    for _ in range(1000):
        roads = junction.get_all_roads()
        assert len(roads) == 4 #should always return 4 roads
