def traffic_volume_inputs(direction):
    
    exiting_traffic1 = -1
    exiting_traffic2 = -1
    exiting_traffic3 = -1
    heading_traffic = -1
    
    #traffic volume inputs 
    while heading_traffic < 0:
        try:
            heading_traffic = float(input(f"Enter the vph heading {direction[0]}: "))
            if heading_traffic < 0:
                print("Traffic flow cannot be negative.")
        except ValueError:
            print("Invalid input. Please enter a valid number.")
    
    while exiting_traffic1 < 0 or exiting_traffic1 > heading_traffic:
        try:
            exiting_traffic1 = float(input(f"Enter the vph exiting {direction[0]}: "))
            if exiting_traffic1 > heading_traffic:
                print("Traffic cannot exit at a faster rate than it comes in.")
            elif exiting_traffic1 < 0:
                print("Traffic flow cannot be negative.")
        except ValueError:
            print("Invalid input. Please enter a number")

    while exiting_traffic2 < 0 or (exiting_traffic1 + exiting_traffic2) > heading_traffic:
        try:
            exiting_traffic2 = float(input(f"Enter the vph exiting {direction[1]}: "))
            if (exiting_traffic1 + exiting_traffic2) > heading_traffic:
                print("Traffic cannot exit at a faster rate than it comes in.")
            elif exiting_traffic2 < 0:
                print("Traffic flow cannot be negative.")
        except ValueError:
            print("Invalid input. Please enter a number")

    while exiting_traffic3 < 0 or (exiting_traffic1 + exiting_traffic2 + exiting_traffic3) != heading_traffic:
        try:
            exiting_traffic3 = float(input(f"Enter the vph exiting {direction[2]}: "))
            if (exiting_traffic1 + exiting_traffic2 + exiting_traffic3) > heading_traffic:
                print("Traffic cannot exit at a faster rate than it comes in.")
            elif (exiting_traffic1 + exiting_traffic2 + exiting_traffic3) < heading_traffic:
                print("Traffic cannot exit at a slower rate than it comes in.")
            elif exiting_traffic3 < 0:
                print("Traffic flow cannot be negative.")
        except ValueError:
            print("Invalid input. Please enter a number")
    
    # Output entered values and ask for confirmation
    print("\nPlease confirm the traffic volume inputs:")
    print(f"Heading traffic (vph) for {direction[0]}: {heading_traffic}")
    print(f"Exiting traffic (vph) for {direction[0]}: {exiting_traffic1}")
    print(f"Exiting traffic (vph) for {direction[1]}: {exiting_traffic2}")
    print(f"Exiting traffic (vph) for {direction[2]}: {exiting_traffic3}")
    
    while True:
        try:
            confirmation = input("Do you confirm these values? (y/n): ").strip().lower()
            if confirmation == 'y':
                return [heading_traffic, exiting_traffic1, exiting_traffic2, exiting_traffic3]
            elif confirmation == 'n':
                print("Please re-enter new values: \n")
                return traffic_volume_inputs(direction)  #ask user for inputs again if they do not confirm
            else:
                print("Invalid input. Please enter 'y' for yes or 'n' for no.")
        except ValueError:
            print("Invalid input. Please enter 'y' or 'n'.")
    

# Calling to get traffic volume inputs for all directions
print("NORTHBOUND TRAFFIC INPUTS")
north_traffic = traffic_volume_inputs(["north", "east", "west"])
print()
print("SOUTHBOUND TRAFFIC INPUTS")
south_traffic = traffic_volume_inputs(["south", "east", "west"])
print()
print("EASTBOUND TRAFFIC INPUTS")
east_traffic = traffic_volume_inputs(["east", "north", "south"])
print()
print("WESTBOUND TRAFFIC INPUTS")
west_traffic = traffic_volume_inputs(["west", "north", "south"])

#outputting values for testing
print(north_traffic)
print(south_traffic)
print(east_traffic)
print(west_traffic)


def lane_configuration(direction_of_lane):
    # Input number of lanes
    number_of_lanes = 0
    while number_of_lanes < 1 or number_of_lanes > 5:
        try:
            number_of_lanes = int(input(f"Enter the number of lanes heading {direction_of_lane}: "))
            if number_of_lanes < 1 or number_of_lanes > 5:
                print("Number of lanes must be between 1 and 5.")
        except ValueError:
            print("Invalid input. Please enter a valid number.")

    #Input for left turn lane
    left_turn_lane = -1
    while left_turn_lane != 0 and left_turn_lane != 1:
        try:
            left_turn_lane = int(input(f"Enter 1 for a left turn lane or 0 for no left turn lane heading {direction_of_lane}: "))
            if left_turn_lane != 0 and left_turn_lane != 1:
                print("Please enter 1 for a left turn lane or 0 for no left turn lane.")
        except ValueError:
            print("Invalid input. Please enter 1 for a left turn lane or 0 for no left turn lane.")

    #Input for bus lane
    bus_lane = -1
    while bus_lane != 0 and bus_lane != 1:
        try:
            bus_lane = int(input(f"Enter 1 for a bus lane or 0 for no bus lane heading {direction_of_lane}: "))
            if bus_lane != 0 and bus_lane != 1:
                print("Please enter 1 for a bus lane or 0 for no bus lane.")
        except ValueError:
            print("Invalid input. Please enter 1 for a bus lane or 0 for no bus lane.")

    #Input for lane priority
    lane_priority = -1
    while lane_priority < 0 or lane_priority > 4:
        try:
            lane_priority = int(input(f"Enter lane priority (between 0 and 4) for the lane heading {direction_of_lane}: "))
            if lane_priority < 0 or lane_priority > 4:
                print("Please enter a priority between 0 and 4.")
        except ValueError:
            print("Invalid input. Please enter a value between 0 and 4.")
    
    #Show the inputs for confirmation
    print("\nPlease confirm the lane configuration inputs:")
    print(f"Number of lanes heading {direction_of_lane}: {number_of_lanes}")
    print(f"Left turn lane: {'Yes' if left_turn_lane == 1 else 'No'}")
    print(f"Bus lane: {'Yes' if bus_lane == 1 else 'No'}")
    print(f"Lane priority for {direction_of_lane}: {lane_priority}")
    
    while True:
        try:
            confirmation = input("Do you confirm these values? (y/n): ").strip().lower()
            if confirmation == 'y':
                return [number_of_lanes, left_turn_lane, bus_lane, lane_priority]
            elif confirmation == 'n':
                print("Please re-enter values: \n")
                return lane_configuration(direction_of_lane)  #ask user for inputs again if they do not confirm
            else:
                print("Invalid input. Please enter 'y' for yes or 'n' for no.")
        except ValueError:
            print("Invalid input. Please enter 'y' or 'n'.")


#calling lane configuration for all directions
lanes = [lane_configuration("northbound"), lane_configuration("southbound"), lane_configuration("eastbound"), lane_configuration("westbound")]
print(lanes)

#setting outbound lanes in all directions to max inbound lanes (avoids merging)
outbound_lanes = 0
for i in range(0, len(lanes)):
    if lanes[i][0] > outbound_lanes:
        outbound_lanes = lanes[i][0]

print(outbound_lanes) #printing outbound lanes for testing
    


                    
    
