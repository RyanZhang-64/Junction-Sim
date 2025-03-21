import os, Junction

# Creates 5 save files if they do not exist already
def create_junction_files():
    folder_name = "savedJunctions"
    os.makedirs(folder_name, exist_ok=True)
    
    for i in range(1, 11):
        file_path = os.path.join(folder_name, f"junction{i}.txt")
        if not os.path.exists(file_path):
            open(file_path, "w").close()
    
    print("Files created successfully")

# Returns if a file is empty - slot not being used
def file_empty(file_path):
    return os.path.exists(file_path) and os.path.getsize(file_path) == 0

# Returns true if there exists a free save file
def free_slot_exists():
    for i in range(1, 11):
        file_path = os.path.join("savedJunctions", f"junction{i}.txt")
        if file_empty(file_path):
            return True
    
    return False

# Returns the first free save file, searching ascending 1-5
def free_slot_number():
    if free_slot_exists():
        for i in range(1, 11):
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
            # Gets metrics of overall junction and writes to file
            junction_metrics = junction_model.get_metrics_as_array()

            for metric in junction_metrics:
                file.write(f"{metric}\n")

            # Considers each junction arm NESW
            junction_roads = junction_model.get_all_roads()

            for road in junction_roads:
                # Gets the metrics of the arm and writes to file
                arm_metrics = road.get_metrics_as_array()

                for metric in arm_metrics:
                    file.write(f"{metric}\n")

                # Gets the configurations of the arm and writes to file
                arm_config = road.get_configuration_as_array()

                for config in arm_config:
                    file.write(f"{config}\n")
        
        return True

# Overwrite file - Clearing the file then saving as normal
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
        return None
    else:
        # Stores lines as a list
        with open(file_path, "r") as file:
            lines = [line.strip() for line in file]  

        # Lines 1 - 7 are junction metrics
        return_junction = Junction.Junction()

        return_junction.mean_wait_mins = float(lines[0])
        return_junction.mean_wait_secs = float(lines[1])
        return_junction.max_wait_mins = float(lines[2])
        return_junction.max_wait_secs = float(lines[3])
        return_junction.max_queue = float(lines[4])
        return_junction.performance = float(lines[5])
        return_junction.environment = float(lines[6])

        direction_ranges = [(0, 7), (1, 21), (2, 35), (3, 48)]
        roads = return_junction.get_all_roads()

        for (direction, start) in direction_ranges:
            road = roads[direction]

            # Metrics
            road.mean_wait_mins = float(lines[start])
            road.mean_wait_secs = float(lines[start + 1])
            road.max_wait_mins = float(lines[start + 2])
            road.max_wait_secs = float(lines[start + 3])
            road.max_queue = float(lines[start + 4])
            road.performance = float(lines[start + 5])
            road.environment = float(lines[start + 6])

            # Configurations
            road.vph_rate = float(lines[start + 7])
            road.priority_factor = float(lines[start + 8])
            road.total_standard_lanes = float(lines[start + 9])
            road.has_bus_lane = lines[start + 10].lower() == "true"
            road.has_left_lane = lines[start + 11].lower() == "true"
            road.has_bike_lane = lines[start + 12].lower() == "true"
            road.puffin_crossing = lines[start + 13].lower() == "true"

        return return_junction

"""
Given a performance score, returns the top % that the score is in,
based on the saved junctions
"""
def top_percent(score, direction, lines_to_read):
    # Creates an array of all the scores for either NESW or whole junction
    stored_scores = []
    line_to_read = lines_to_read[direction + 1]
    
    # Searches every file
    for i in range(1, 11):
        file_path = os.path.join("savedJunctions", f"junction{i}.txt")
        if not file_empty(file_path):
            with open(file_path, "r") as file:
                lines = file.readlines()
                if len(lines) >= line_to_read:  
                    stored_scores.append(float(lines[line_to_read - 1].strip()))
                else:
                    return None  # Not enough lines in the file

    # If there are no scores on file, the score is in the top 100%
    if stored_scores == []:
        return 100

    # Calculate the percentage rank of this score
    stored_scores.append(score)
    stored_scores = sorted(stored_scores, reverse=True) # Descending
    rank = stored_scores.index(score) + 1 # Get rank
    percentile = (rank / len(stored_scores)) * 100 # Gets percentile

    return round(percentile, 2) # To 2dp

"""
Direction of -1 represents the overall junction
"""
def top_percent_environment(score, direction):
    lines_to_read = [14, 28, 42, 55]
    return top_percent(score, direction, lines_to_read)

def top_percent_performance(score, direction):
    lines_to_read = [13, 27, 41, 54]
    return top_percent(score, direction, lines_to_read)
