import statistics

# NOTE: Assumed vph_rates is just the rates from North, South, West, East without the breakdown around the direction the cars are leaving to, may need to change this!

# QUESTION: are typing these methods and inputs worth it or is that too non pythonic

def get_efficiency_score(vph_rates, setup):
    # TODO: implement aggregating function
    return -1


def max_queue(vph_rates, setup, direction):
    #TODO: complete base implementation
    #TODO: implement for various different configurables.
    return 0


def max_wait(vph_rates, setup, direction):
    # TODO: complete base implementation
    # TODO: implement for various different configurables.
    return 0


def average_wait(vph_rates, setup, direction):
    # TODO: complete base implementation
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









