import statistics, numpy

CYCLE_LENGTH = 4             # (minutes)
MAX_VEHICLE_MOVEMENT = 180   # vph rate at which cars can pass through the junction

# Metric calculations -------

# Efficiency score of overall junction
def get_efficiency_score(vph_rates, setup):
    FAIRNESS_EXTREME_BOUNDARY = 400
    WORST_CASE_EXTREME_BOUNDARY = 75

    total_efficiency = (mean_statistic(vph_rates, setup) * 60
                        + numpy.exp(fairness_statistic(vph_rates, setup) - FAIRNESS_EXTREME_BOUNDARY)
                        + numpy.exp(worst_case_statistic(vph_rates, setup) - WORST_CASE_EXTREME_BOUNDARY))
    total_efficiency = 99 / (1 + numpy.exp(-(1/5) * (total_efficiency - 75))) + 1 # Sigmoid
    total_efficiency = 100 - total_efficiency
    return round(total_efficiency,2)

# Maximum queue
def max_queue(vph_rates, setup, direction):
    road = setup.get_road(direction)
    proportion_green = get_green_proportion(setup, direction)

    arriving_per_cycle = ((vph_rates[direction] / road.total_standard_lanes) * (CYCLE_LENGTH / 60))
    leaving_per_cycle = (MAX_VEHICLE_MOVEMENT * (proportion_green * (CYCLE_LENGTH / 60)))
    
    # Max of 0 and cars accumulated after one full cycle
    return max(0, arriving_per_cycle - leaving_per_cycle, 3/4 * arriving_per_cycle) 

# Heavily affected by max_queue()
def max_wait(vph_rates, setup, direction):
    proportion_green = get_green_proportion(setup, direction)
    leaving_per_cycle = (MAX_VEHICLE_MOVEMENT * (proportion_green * (CYCLE_LENGTH / 60)))

    return ((max_queue(vph_rates, setup, direction) / leaving_per_cycle) # Number of Cycles to remove cars
            * CYCLE_LENGTH) 

# Assigns an environmental score based on the sustainable options used in design
def environmental_score(has_bike_lane, has_bus_lane, has_puffin_crossing):
    env_score = 100
    if has_bike_lane:
        env_score *= 0.5
    if has_bus_lane:
        env_score *= 0.6
    if has_puffin_crossing:
        env_score *= 0.9
    
    return env_score

def average_wait(vph_rates, setup, direction):
    road = setup.get_road(direction)
    arriving_per_cycle = ((vph_rates[direction] / road.total_standard_lanes) * (CYCLE_LENGTH / 60))

    # Total time to clear the vehicles divided by the total number of vehicles arriving
    return max_wait(vph_rates, setup, direction) / arriving_per_cycle 

# Helper functions -------

def get_green_proportion(setup, direction):
    total_priority = sum([x.priority_factor for x in setup.get_all_roads()])
    this_priority = setup.get_road(direction).priority_factor
    pedestrian_factor = 1

    # Assumes pedestrians get ~1/5 of the cycle time 
    if setup.puffin_crossings:
        pedestrian_factor = 4/5 

    return (this_priority / total_priority) * pedestrian_factor

"""
The average_wait time for any car at the junction.
Used to compare overall junction setup effectivity
"""
def mean_statistic(vph_rates, setup):
    mean = 0
    total_vph = sum(vph_rates)
    for i in range(0, 4):
        mean += (vph_rates[i] / total_vph) * average_wait(vph_rates, setup, i)
    return mean

"""
Variance of the max_queue's weighted by the proportion of cars from that direction.
Used to compare the relative ease of moving through the junctions from different directions,
taking into account how busy that direction is
"""
def fairness_statistic(vph_rates, setup):
    total_vph = sum(vph_rates)
    values = [(vph_rates[i] / total_vph) * max_queue(vph_rates, setup, i) for i in range(0, 4)]
    return statistics.pvariance(values)

# max_wait time for any car at the junction, used to compare outlier experiences of vehicles
def worst_case_statistic(vph_rates,setup):
    worst_wait = 0
    for i in range(0, 4):
        max_wait_in_direction = max_wait(vph_rates, setup, i)
        worst_wait = max(worst_wait, max_wait_in_direction)
    return worst_wait



    







