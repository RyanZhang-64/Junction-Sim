from InboundRoad import InboundRoad
import Equations
import math

class Junction:
    def __init__(self):

        """
        The junction stores an array/list of junction arm objects
        0 = North, 1 = East, 2 = South, 3 = West
        """
        self.in_roads = [(InboundRoad()) for i in range(0,4)]
        self.puffin_crossings = False

        # Metrics
        self.mean_wait_secs = 0
        self.mean_wait_mins = 0
        self.max_wait_mins = 0
        self.max_wait_secs = 0
        self.max_queue = 0
        self.performance = 0
        self.environment = 0

    # Returns the metrics as an array
    def get_metrics_as_array(self):
        return [self.mean_wait_mins, self.mean_wait_secs, self.max_wait_mins, self.max_wait_secs, self.max_queue, self.performance, self.environment]
    
    # Returns the array/list of all junction arms
    def get_all_roads(self):
        return self.in_roads
    
    # Gets a junction arm for a particular direction
    def get_road(self, index):
        return self.in_roads[index]
    
    # Returns an array/list of vph rates across junction arms
    def get_vph_rates(self):
        vph_rates = []
        for arm in self.get_all_roads():
            vph_rates.append(arm.vph_rate)
        return vph_rates

    # Accesses metrics for the junction

    def get_efficiency_score(self, vph_rates):
        return Equations.get_efficiency_score(vph_rates, self)

    def get_max_wait(self, vph_rates):
        return round(Equations.worst_case_statistic(vph_rates, self) * 60,2)

    def get_max_queue(self, vph_rates):
        return math.ceil(max([Equations.max_queue(vph_rates,self, direction = x) for x in range(0,4)]))

    def get_average_wait(self, vph_rates):
        return round(self.get_max_wait(vph_rates)/Equations.MAX_VEHICLE_MOVEMENT *60,2)
    
    """
    Environment score for the junction is the average
    of environment scores across the arms
    """
    def get_environment_score_junction(self):
        score = 0
        for arm in self.get_all_roads():
            score += arm.get_arm_environment_score()
        
        return score / 4

    # Updates the junction metrics before being displayed to the user

    def update_junction_metrics(self):
        # Get vph rates for each junction arm
        vph_rates = [arm.vph_rate for arm in self.get_all_roads()]

        # Compute mean and max wait times
        mean_wait = self.get_average_wait(vph_rates)
        max_wait = self.get_max_queue(vph_rates)

        # Convert mean wait time to minutes and seconds
        self.mean_wait_mins, self.mean_wait_secs = divmod(math.ceil(mean_wait), 60)

        # Convert max wait time to minutes and seconds
        self.max_wait_mins, self.max_wait_secs = divmod(math.ceil(max_wait), 60)

        # Compute other metrics
        self.max_queue = self.get_max_queue(vph_rates)
        self.performance = self.get_efficiency_score(vph_rates)
        self.environment = self.get_environment_score_junction()







    