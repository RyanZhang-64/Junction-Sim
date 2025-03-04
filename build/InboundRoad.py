from build import Equations

import Equations

class InboundRoad:
    def __init__(self):
        self.total_standard_lanes = 1
        self.has_bus_lane = False
        self.has_left_lane = False
        self.priority_factor = 1

        # Lucy added
        self.puffin_crossing = False

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

    def toggle_puffin_crossing(self):
        self.puffin_crossing = not self.puffin_crossing
    
    def has_puffin_crossing(self):
        return self.puffin_crossing

    def get_max_wait(self, vph_rates, junction, road_direction):
        return round(Equations.max_wait(vph_rates, junction, road_direction)*60, 2)

    def get_max_queue(self, vph_rates, junction, road_direction):
        return Equations.max_queue(vph_rates, junction, road_direction)

    def get_average_wait(self, vph_rates, junction, road_direction):
        return round(Equations.average_wait(vph_rates, junction, road_direction)*60, 2)

if __name__ == "__main__":
    from Junction import Junction
    junction = Junction()
    lst = [100,100,100,100]
    print("avg", InboundRoad().get_average_wait(lst,junction,1))
    print("max Q", InboundRoad().get_max_queue(lst,junction,1))
    print("max W", InboundRoad().get_max_wait(lst,junction,1))