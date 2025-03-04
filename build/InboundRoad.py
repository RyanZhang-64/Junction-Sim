import numpy

import Equations
import math

class InboundRoad:
    def __init__(self):
        self.total_standard_lanes = 1
        self.has_bus_lane = False
        self.has_bike_lane = False
        self.has_left_lane = False
        self.priority_factor = 1
        self.puffin_crossing = False

        self.vph_rate = 100

        # Storing metrics
        self.mean_wait_secs = 0
        self.mean_wait_mins = 0
        self.max_wait_mins = 0
        self.max_wait_secs = 0
        self.max_queue = 0
        self.performance = 0

        self.environment = 0
    
    def get_metrics_as_array(self):
        return [self.mean_wait_mins, self.mean_wait_secs, 
                self.max_wait_mins, self.max_wait_secs,
                self.max_queue, self.performance,
                self.environment]
    
    def get_configuration_as_array(self):
        return [self.priority_factor, self.total_standard_lanes, self.has_bus_lane,
                self.has_left_lane, self.puffin_crossing, self.has_bike_lane]

    # Updates the junction arms metrics
    def update_junction_arm_metrics(self, vph_rates, junction, road_direction):

        


        mean_wait = self.get_average_wait(vph_rates, junction, road_direction)
        max_wait = self.get_max_queue(vph_rates, junction, road_direction)

        if mean_wait < 60:
            self.mean_wait_mins = 0
            self.mean_wait_secs = mean_wait
        else:
            self.mean_wait_mins = math.floor(mean_wait / 60)
            self.mean_wait_secs = math.ceil(mean_wait - (60 * self.mean_wait_mins))

        if max_wait < 60:
            self.max_wait_mins = 0
            self.max_wait_secs = max_wait
        else:
            self.max_wait_mins = math.floor(max_wait / 60)
            self.max_wait_secs = math.ceil(max_wait - (60 * self.max_wait_mins))  

        self.max_queue = self.get_max_queue(vph_rates, junction, road_direction)

        self.environment = self.get_arm_environment_score()
        self.performance = self.get_arm_efficiency_score(vph_rates, junction, road_direction)

    # Here we return the number of lanes that the road has 
    def get_total_standard_lanes(self):
        return self.total_standard_lanes
    
    # Takes in the number of lanes and increments or decrements based on which button is pressed 
    # Shouldn't return anything
    # This should take in a signal based on which button is pressed and then increment or decrement based on which is clicked
    def set_total_standard_lanes(self, num : int):
        self.total_standard_lanes = num

    # Returns the boolean if there is a bus lane or if there isn't

    # changed name because property has same name
    def is_bus_lane(self):
        return self.has_bus_lane
    
    def is_bike_lane(self):
        return self.has_bike_lane

    # Changes the flag if there is a bus lane or if there isn't
    # has_bus should be the input if the toggle is on or not
    def set_has_bus_lane(self, has_bus : bool):
        self.has_bus_lane = has_bus
    
    # Returns if there is a bus lane or not (Boolean)
    def is_left_lane(self):
        return self.has_left_lane
    
    # Changes the flag if there is a left lane or not
    # Shouldn't return anything
    # Same logic as the bus lane
    def set_has_left_lane(self, has_left : bool):
        self.has_left_lane = has_left
    
    # Returns what the priority factor is

    # changed name here again
    def get_priority_factor(self):
        return self.priority_factor
    
    # Allows for the priority factor to be changed
    def set_priority_factor(self, num :int):
        self.priority_factor = num


    # Lucy added

    def increment_num_lanes(self):
        if self.total_standard_lanes != 5:
            self.total_standard_lanes += 1
        else:
            print("Cannot exceed 5 lanes")

    def decrement_num_lanes(self):
        if self.total_standard_lanes != 1:
            self.total_standard_lanes -= 1
        else:
            print("Must have atleast one lane")

    def get_num_lanes(self):
        return self.total_standard_lanes

    def toggle_bus_lane(self):
        self.has_bus_lane = not self.has_bus_lane

    def toggle_left_lane(self):
        self.has_left_lane = not self.has_left_lane

    def toggle_bike_lane(self):
        self.has_bike_lane = not self.has_bike_lane

    def toggle_puffin_crossing(self):
        self.puffin_crossing = not self.puffin_crossing
    
    def has_puffin_crossing(self):
        return self.puffin_crossing

    def get_max_wait(self, vph_rates, junction, road_direction):
        #print(round(Equations.max_wait(vph_rates, junction, road_direction)*60, 2))
        return round(Equations.max_wait(vph_rates, junction, road_direction)*60, 2)

    def get_max_queue(self, vph_rates, junction, road_direction):
        return math.ceil(Equations.max_queue(vph_rates, junction, road_direction))

    def get_average_wait(self, vph_rates, junction, road_direction):
        #print(round(Equations.average_wait(vph_rates, junction, road_direction)*60, 2))
        return round(Equations.average_wait(vph_rates, junction, road_direction)*60, 2)
    
    def get_arm_environment_score(self):
        #print("SCORE")
        #print(Equations.environmental_score(self.has_bike_lane, self.has_bus_lane, self.has_puffin_crossing))
        return Equations.environmental_score(self.has_bike_lane, self.has_bus_lane, self.has_puffin_crossing)

    def get_arm_efficiency_score(self, vph_rates, junction, road_direction):
        FAIRNESS_EXTREME_BOUNDARY = 400
        WORST_CASE_EXTREME_BOUNDARY = 75
        ##TODO: include environmental factors!!!
        total_efficiency = (self.get_average_wait(vph_rates,junction, road_direction)
                            + (self.get_max_queue(vph_rates, junction, road_direction) * 1/FAIRNESS_EXTREME_BOUNDARY)
                            + (self.get_max_queue(vph_rates, junction, road_direction) * 1/FAIRNESS_EXTREME_BOUNDARY))
        total_efficiency = 99 / (1 + numpy.exp(-(1 / 5) * (total_efficiency - 75))) + 1  ## Sigmoid
        total_efficiency = 100 - total_efficiency
        return round(total_efficiency, 2)




if __name__ == "__main__":
    from Junction import Junction
    junction = Junction()
    lst = [500,500,500,500]
    print("total", InboundRoad().get_arm_efficiency_score(lst, junction, 1))
    print("avg", InboundRoad().get_average_wait(lst,junction,1))
    print("max Q", InboundRoad().get_max_queue(lst,junction,1))
    print("max W", InboundRoad().get_max_wait(lst,junction,1))