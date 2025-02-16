import trafficflow.py

# This is the function which should be run if the left turn priority lanes are switched on

# Takes in cur_vehicles_per_lane which is an array containing the current number of vehicles leaving each lane 
# (this is just an array of B values as per the mathematical model) and this should be ordered from leftmost lane to the right

# time is the time taken for a full traffic cycle

# direction is the direction that traffic is heading to in the arm we have chosen

# Will return an array containing the new vph per each lane

def left_turn(cur_vehicles_per_lane, time, direction, has_bus, has_cycle):

    # A check to not allow this if there is bus lane or a cycle lane already
    if has_bus == True or has_cycle == True:
        print("We cannot have a left turn lane if there is a bus lane or a cycle lane")
        return 0

    new_vehicles_exiting = []
    
    # Calls traffic_volume_inputs to get vehicles heading left
    # The way i've interpreted this is that vehicles heading say southbound, then the vehicles heading left are the ones going east 
    # This also assumes that the function is not given the number of vehicles that want to go left 
        # If it is, then these if statements can be removed, and then the function just needs to take in num of vehicles heading left
    if direction == "north":
        exiting = traffic_volume_inputs(["north", "east", "west"])
        heading_left = exiting[2] * (time/60)
    elif direction == "south":
        exiting = traffic_volume_inputs(["south", "east", "west"])
        heading_left = exiting[1] * (time/60)
    elif direction == "east":
        exiting = traffic_volume_inputs(["east", "north", "south"])
        heading_left = exiting[1] * (time/60)
    else:
        exiting = traffic_volume_inputs(["west", "north", "south"])
        heading_left = exiting[2] * (time/60)

    # So the leftmost lane only contains cars exiting left
    new_vehicles_exiting.append(heading_left)

    # To get the current number of vehicles in the leftmost lane
    c_left = cur_vehicles_per_lane[0]

    # Number of lanes we need to distribute into
    remaining_lanes = len(cur_vehicles_per_lane) - 1

    # If there are leftover lanes 
    # Validation to ensure that if there is only one lane, then we can only have a left lane if all vehicles are going left
    if (len(cur_vehicles_per_lane) == 1 and c_left == heading_left) or (len(cur_vehicles_per_lane) > 1):
        
        if remaining_lanes > 0:
            vehicles_to_distribute = (c_left-heading_left) // remaining_lanes
            left_over = (c_left-heading_left) % remaining_lanes

        # Adds the new number of vehicles to each lane, evenly distributing them across the remaining lanes
        for i in range(1, remaining_lanes+1):
            new_vehicles_exiting.append(cur_vehicles_per_lane[i] + vehicles_to_distribute)

        # Put cars in the remaining lanes until they are full 
        index = 1
        while left_over > 0:
            # If on the last lane, then place whatever vehicles are left in it
            if index == remaining_lanes:
                new_vehicles_exiting[index] = new_vehicles_exiting[index] + left_over

            # Otherwise add one vehicle to each lane till full
            new_vehicles_exiting[index] = new_vehicles_exiting[index] + 1
            left_over-=1
            index+=1
            
    return new_vehicles_exiting
