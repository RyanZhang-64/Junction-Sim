from InboundRoad import InboundRoad
import Equations
import math

class Junction:
    def __init__(self):
        self.in_roads = [(InboundRoad()) for i in range(0,4)]
        self.puffin_crossings = False

        # Storing metrics
        self.mean_wait_secs = 0
        self.mean_wait_mins = 0
        self.max_wait_mins = 0
        self.max_wait_secs = 0
        self.max_queue = 0
        self.performance = 0

        self.environment = 0

    # Returns the metrics as an array
    def get_metrics_as_array(self):
        return [self.mean_wait_mins, self.mean_wait_secs, 
                self.max_wait_mins, self.max_wait_secs,
                self.max_queue, self.performance,
                self.environment]

    def efficiency_score(self, vph_rates):
        return Equations.get_efficiency_score(vph_rates, self)

    def get_all_roads(self):
        return self.in_roads

    # Use get road to set InboundRoad Properties
    def get_road(self, index):
        return self.in_roads[index]

    # TODO: getters and setters where applicable

    # 0 = north, 1 = east. 2 = south, 3 = west

    def get_lane(self, direction):
        if direction == "north":
            return self.in_roads[0]
        elif direction == "east":
            return self.in_roads[1]
        elif direction == "south":
            return self.in_roads[2]
        elif direction == "west":
            return self.in_roads[3]


    # Junction Metrics

    def get_max_wait(self, vph_rates):
        return round(Equations.worst_case_statistic(vph_rates, self) * 60,2)

    def get_max_queue(self, vph_rates):
        return math.ceil(max([Equations.max_queue(vph_rates,self, direction = x) for x in range(0,4)]))

    def get_average_wait(self, vph_rates):
        return round(self.get_max_wait(vph_rates)/Equations.MAX_VEHICLE_MOVEMENT *60,2)
    
    def update_junction_metrics(self, vph_rates):
        mean_wait = self.get_average_wait(vph_rates)
        max_wait = self.get_max_queue(vph_rates)

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

        self.max_queue = self.get_max_queue(vph_rates)
        self.performance = self.efficiency_score(vph_rates)
        self.environment = self.get_environment_score_junction()
    
    # Gets the mean of environment score for each arm
    def get_environment_score_junction(self):
        s = 0
        for arm in self.get_all_roads():
            #print(s)
            s += arm.get_arm_environment_score()
        
        return s / 4


if __name__ == "__main__":
    lst = [100,100,100,100]
    print("avg", Junction().get_average_wait(lst))
    print("max Q", Junction().get_max_queue(lst))
    print("max W", Junction().get_max_wait(lst))




    