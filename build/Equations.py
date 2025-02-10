import statistics

from build.Junction import Junction

# NOTE: Assumed vph_rates is just the rates from North, South, West, East without the breakdown around the direction the cars are leaving to, may need to change this!

# QUESTION: are typing these methods and inputs worth it or is that too non pythonic

CYCLE_LENGTH = 4 # (minutes)
PROPORTION_GREEN = 1 / 4.0
PROPORTION_RED = 3 / 4.0
MAX_VEHICLE_MOVEMENT = 1600

def get_efficiency_score(vph_rates, setup):
    # TODO: implement aggregating function
    return -1


def max_queue(vph_rates, setup : Junction , direction):
    # DONE: complete base implementation
    arriving_per_cycle = ((vph_rates[direction] / setup.get_road(direction).total_standard_lanes())
                          * (CYCLE_LENGTH / 60))
    leaving_per_cycle = (MAX_VEHICLE_MOVEMENT
                         * (PROPORTION_GREEN * (CYCLE_LENGTH / 60)))
    return max(0, arriving_per_cycle - leaving_per_cycle)  # max of 0 and cars accumulated after one full cycle
    # , 3/4 arriving_per_cycle)      # NOTE: it is possible to accumulate a larger queue (=3/4 cars) before cars leave the junction (should probably include this

    #TODO: implement for various different configurables.
    return 0


def max_wait(vph_rates, setup, direction):
    # DONE: complete base implementation
    leaving_per_cycle = (MAX_VEHICLE_MOVEMENT
                         * (PROPORTION_GREEN * (CYCLE_LENGTH / 60)))
    return ((max_queue(vph_rates, setup, direction) / leaving_per_cycle) # Number of Cycles to remove cars
            * CYCLE_LENGTH) # length a cycle takes
    # NOTE: This has a rounding error as you can't complete, say 0.3 cycles, can round up maybe
    # TODO: implement for various different configurables.
    return 0


def average_wait(vph_rates, setup, direction):
    # TODO: complete base implementation
    arriving_per_cycle = ((vph_rates[direction] / setup.get_road(direction).total_standard_lanes())
                          * (CYCLE_LENGTH / 60))
    return max_wait(vph_rates, setup, direction) / arriving_per_cycle # the total time to clear the vehicles divided by the total number of vehicles arriving
    # TODO: implement for various different configurables.
    return 0


def mean_statistic(vph_rates, setup):
    mean = 0
    total_vph = sum(vph_rates)
    for i in range(0, 4):
        mean += (vph_rates[i] / total_vph) * average_wait(vph_rates, setup, i)
    return mean


def fairness_statistic(vph_rates, setup):
    total_vph = sum(vph_rates)
    values = [(vph_rates[i] / total_vph) * max_queue(vph_rates, setup, i) for i in range(0, 4)]
    return statistics.pvariance(values)


def worst_case_statistic(vph_rates,setup):
    worst_wait = 0
    for i in range(0, 4):
        max_wait_in_direction = max_wait(vph_rates, setup, i)
        worst_wait = max(worst_wait, max_wait_in_direction)
    return worst_wait









