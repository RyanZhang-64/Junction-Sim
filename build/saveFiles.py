import os
import InboundRoad, Junction

# Creates 5 save files if they do not exist already
def create_junction_files():
    folder_name = "savedJunctions"
    os.makedirs(folder_name, exist_ok=True)
    
    for i in range(1, 6):
        file_path = os.path.join(folder_name, f"junction{i}.txt")
        if not os.path.exists(file_path):
            open(file_path, "w").close()
    
    print("Files created successfully!")

# Returns if a file is empty - slot not being used
def file_empty(file_path):
    return os.path.exists(file_path) and os.path.getsize(file_path) == 0

# Returns true if there exists a free save file
def free_slot_exists():

    for i in range(1, 6):
        file_path = os.path.join("savedJunctions", f"junction{i}.txt")
        if file_empty(file_path):
            return True
    
    return False

# Returns the first free save file, searching ascending 1-5
def free_slot_number():
    if free_slot_exists():
        for i in range(1, 6):
            file_path = os.path.join("savedJunctions", f"junction{i}.txt")
            if file_empty(file_path):
                return i
    
    return None

# Writes a given junction to a file, returns True upon success, false otherwise
def save_junction_to_file(junction_model: Junction):
    if not free_slot_exists():
        return False
    else:
        slot = free_slot_number()
        file_path = os.path.join("savedJunctions", f"junction{slot}.txt")

        with open(file_path, "w") as file:
            # Gets metrics of overall junction - write
            junction_metrics = junction_model.get_metrics_as_array()

            for metric in junction_metrics:
                file.write(f"{metric}\n")

            # Considers each junction arm NESW
            junction_roads = junction_model.get_all_roads()

            for road in junction_roads:
                # Gets the metrics of the arm
                arm_metrics = road.get_metrics_as_array()

                for metric in arm_metrics:
                    file.write(f"{metric}\n")

                # Gets the config of the arm
                arm_config = road.get_configuration_as_array()

                for config in arm_config:
                    file.write(f"{config}\n")
        
        return True

# Overwrite file - Clear the file, then call the above function
def overwrite_file(junction_model: Junction, save_number):
    file_path = f"savedJunctions/junction{save_number}.txt"

    if os.path.exists(file_path):
        open(file_path, "w").close()
        return save_junction_to_file(junction_model)
    else:
        return False

# Create a model from a save file
def create_model_from_save(save_number):
    file_path = f"savedJunctions/junction{save_number}.txt"

    if file_empty(file_path):
        print("No data in this save")
        return None
    else:
        print("there is data here")
        # TODO

        with open(file_path, "r") as file:
            lines = [line.strip() for line in file]  # Stores lines as a list

        # Lines 1 - 6 are junction metrics
        return_junction = Junction.Junction()
        return_junction.mean_wait_mins = int(lines[0])
        return_junction.mean_wait_secs = int(lines[1])
        return_junction.max_wait_mins = int(lines[2])
        return_junction.max_wait_secs = int(lines[3])
        return_junction.max_queue = int(lines[4])
        return_junction.performance = float(lines[5])

        direction_ranges = [(0, 6, 16), (1, 17, 27), (2, 28, 38), (3, 39, 49)]
        roads = return_junction.get_all_roads()

        for (direction, start, end) in direction_ranges:
            road = roads[direction]

            # Metrics
            road.mean_wait_mins = int(lines[start])
            road.mean_wait_secs = int(lines[start + 1])
            road.max_wait_mins = int(lines[start + 2])
            road.max_wait_secs = int(lines[start + 3])
            road.max_queue = int(lines[start + 4])
            road.performance = float(lines[start + 5])

            # Config
            road.priority_factor = int(lines[start + 6])
            road.total_standard_lanes = int(lines[start + 7])

            road.has_bus_lane = lines[start + 8].lower() == "true"
            road.has_left_lane = lines[start + 9].lower() == "true"
            road.puffin_crossing = lines[start + 10].lower() == "true"

        save_junction_to_file(return_junction)

        return return_junction




