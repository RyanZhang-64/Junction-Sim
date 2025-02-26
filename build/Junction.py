import Equations
from InboundRoad import InboundRoad

class Junction:
    def __init__(self):
        self.in_roads = [(InboundRoad()) for i in range(0,4)]
        self.puffin_crossings = False

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


    