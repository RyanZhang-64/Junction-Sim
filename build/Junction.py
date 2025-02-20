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