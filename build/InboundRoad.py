import numpy

import Equations
import math

class InboundRoad:
    def __init__(self):

        # Configurations
        self.total_standard_lanes = 1
        self.has_bus_lane = False
        self.has_bike_lane = False
        self.has_left_lane = False
        self.priority_factor = 1
        self.puffin_crossing = False
        self.vph_rate = 100

        # Metrics
        self.mean_wait_secs = 0
        self.mean_wait_mins = 0
        self.max_wait_mins = 0
        self.max_wait_secs = 0
        self.max_queue = 0
        self.performance = 0
        self.environment = 0
    
    """
    Returns all metrics and configurables of the junction arm as an array/list, 
    to display to the user
    """

    def get_metrics_as_array(self):
        return [self.mean_wait_mins, self.mean_wait_secs, self.max_wait_mins, self.max_wait_secs, self.max_queue, self.performance, self.environment]
    
    def get_configuration_as_array(self):
        return [self.vph_rate, self.priority_factor, self.total_standard_lanes, self.has_bus_lane, self.has_left_lane, self.has_bike_lane, self.puffin_crossing]
    
    def set_priority_factor(self, num :int):
        self.priority_factor = num

    # Checks that lanes will not exceed 5 before incrementing
    def increment_num_lanes(self):
        if self.total_standard_lanes != 5:
            self.total_standard_lanes += 1
    
    # Checks that lanes will not become 0 before decrementing
    def decrement_num_lanes(self):
        if self.total_standard_lanes != 1:
            self.total_standard_lanes -= 1

    """
    Each function, when the bike/left/bus lane is enabled, will disable
    all other types of lanes
    """

    def toggle_bus_lane(self):
        self.has_bus_lane = not self.has_bus_lane
        self.has_bike_lane, self.has_left_lane = False, False

    def toggle_left_lane(self):
        self.has_left_lane = not self.has_left_lane
        self.has_bike_lane, self.has_bus_lane = False, False

    def toggle_bike_lane(self):
        self.has_bike_lane = not self.has_bike_lane
        self.has_bus_lane, self.has_left_lane = False, False

    def toggle_puffin_crossing(self):
        self.puffin_crossing = not self.puffin_crossing

    # Accesses metrics for this junction arm

    def get_max_wait(self, vph_rates, junction, road_direction):
        return round(Equations.max_wait(vph_rates, junction, road_direction)*60, 2)

    def get_max_queue(self, vph_rates, junction, road_direction):
        return math.ceil(Equations.max_queue(vph_rates, junction, road_direction))

    def get_average_wait(self, vph_rates, junction, road_direction):
        return round(Equations.average_wait(vph_rates, junction, road_direction)*60, 2)
    
    def get_arm_environment_score(self):
        return Equations.environmental_score(self.has_bike_lane, self.has_bus_lane, self.puffin_crossing)

    def get_arm_efficiency_score(self, vph_rates, junction, road_direction):
        FAIRNESS_EXTREME_BOUNDARY = 400
        total_efficiency = (self.get_average_wait(vph_rates,junction, road_direction)
                            + (self.get_max_queue(vph_rates, junction, road_direction) * 1/FAIRNESS_EXTREME_BOUNDARY)
                            + (self.get_max_queue(vph_rates, junction, road_direction) * 1/FAIRNESS_EXTREME_BOUNDARY))
        total_efficiency = 99 / (1 + numpy.exp(-(1 / 5) * (total_efficiency - 75))) + 1  ## Sigmoid
        total_efficiency = 100 - total_efficiency
        return round(total_efficiency, 2)
    
    # Updates the junction arms metrics before being displayed to the user

    def update_junction_arm_metrics(self, vph_rates, junction, road_direction):
        # Calculate mean and max wait times
        mean_wait = self.get_average_wait(vph_rates, junction, road_direction)
        max_wait = self.get_max_queue(vph_rates, junction, road_direction)

        # Convert mean wait time to minutes and seconds
        self.mean_wait_mins = math.floor(mean_wait / 60) if mean_wait >= 60 else 0
        self.mean_wait_secs = math.ceil(mean_wait % 60)

        # Convert max wait time to minutes and seconds
        self.max_wait_mins = math.floor(max_wait / 60) if max_wait >= 60 else 0
        self.max_wait_secs = math.ceil(max_wait % 60)

        # Compute other metrics
        self.max_queue = self.get_max_queue(vph_rates, junction, road_direction)
        self.environment = self.get_arm_environment_score()
        self.performance = self.get_arm_efficiency_score(vph_rates, junction, road_direction)