class InboundRoad:
    def __init__(self):
        self.total_standard_lanes = 1
        self.has_bus_lane = False
        self.has_left_lane = False
        self.priority_factor = 1

    # Here we return the number of lanes that the road has 
    def total_standard_lanes(self):
        return self.total_standard_lanes
    
    # Takes in the number of lanes and increments or decrements based on which button is pressed 
    # Shouldn't return anything
    # This should take in a signal based on which button is pressed and then increment or decrement based on which is clicked
    def set_total_standard_lanes(self, num : int):
        self.total_standard_lanes = num

    # Returns the boolean if there is a bus lane or if there isn't
    def has_bus_lane(self):
        return self.has_bus_lane

    # Changes the flag if there is a bus lane or if there isn't
    # has_bus should be the input if the toggle is on or not
    def set_has_bus_lane(self, has_bus : bool):
        self.has_bus_lane = has_bus
    
    # Returns if there is a bus lane or not (Boolean)
    def has_left_lane(self):
        return self.has_left_lane
    
    # Changes the flag if there is a left lane or not
    # Shouldn't return anything
    # Same logic as the bus lane
    def set_has_left_lane(self, has_left : bool):
        self.has_left_lane = has_left
    
    # Returns what the priority factor is
    def priority_factor(self):
        return self.priority_factor
    
    # Allows for the priority factor to be changed
    def set_priority_factor(self, num :int):
        self.priority_factor = num

