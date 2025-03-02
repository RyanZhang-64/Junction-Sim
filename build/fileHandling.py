# File ----------------------------------------------------------------

folder = "savedJunctions"
filename = os.path.join(folder, "savedJunctions.txt")

# Check if the file exists
if not os.path.exists(filename):
    # Create an empty file
    with open(filename, "w") as file:
        pass  # This just ensures the file is created and left empty
    print(f"{filename} created successfully.")
else:
    print(f"{filename} already exists.")

# check whether we have reached 5 save files already
def full_num_saves():
    global filename
    if not check_line_not_occupied(1) and not check_line_not_occupied(25):
        if not check_line_not_occupied(49) and not check_line_not_occupied(73):
            if not check_line_not_occupied(97):
                return True
    return False

# Saves info about current junction to file
def save_current_model():
    global junction_model
    if not full_num_saves():

        

        print("file is not full")
        # temp_vph_rates = [100, 100, 100, 100]
        #mean_wait = junction_model.efficiency_score(temp_vph_rates)

        roads = junction_model.get_all_roads()

        bus_lanes = [i.is_bus_lane() for i in roads]
        left_lanes = [i.is_left_lane() for i in roads]
        #TODO add bike lane later
        bike_lanes = ["bike lane" for i in roads]
        num_lanes = [i.get_total_standard_lanes() for i in roads]
        priorities = [i.get_priority_factor() for i in roads]
        puffin_crossings = [i.has_puffin_crossing() for i in roads]

        # TODO - find the first non occupied line to write this info to



        # writing data to file
        with open(filename, "a") as file:
            for i in range(0, 4):
                file.write(f"{bus_lanes[i]}\n")
                file.write(f"{left_lanes[i]}\n")
                file.write(f"{bike_lanes[i]}\n")
                file.write(f"{num_lanes[i]}\n")
                file.write(f"{priorities[i]}\n")
                file.write(f"{puffin_crossings[i]}\n")
    else:
        print("Full save files")

def check_line_not_occupied(self, line_num):
    try:
        with open(filename, "r") as file:
            lines = file.readlines()

        if len(lines) < line_num:
            return False  # Line 120 does not exist
        return bool(lines[line_num - 1].strip())  
        # True if line 120 has content, False if empty
    except FileNotFoundError:
        print("File not found.")
        return False

# Get junction
# Given a save file (1-5) returns a junction object
def get_saved_junction(self, save_file):
    global filename

    # start line of each junction
    start_line = 1 + ((save_file - 1) * 24)
    
    if check_line_not_occupied(start_line):
        print("Nothing is saved here")
        return None
    else:
        print("Something is saved here")

        # Parses the data on txt file
        junction_save = []

        try:
            with open(filename, 'r') as file:
                lines = file.readlines()

                for line_number in range(start_line, start_line + 24):
                    if line_number < len(lines):  
                        junction_save.append(lines[line_number].strip())  
                    else:
                        break  # If we reach the end of the file, stop
        except FileNotFoundError:
            print(f"The file {filename} does not exist.")
        except Exception as e:
            print(f"An error occurred: {e}")
        
        return_junction = Junction.Junction()

        # Builds the junction using the data
        for i in range(junction_save):
            # determines direction
            if i < 6:
                dir = 0
            elif i >= 6 and i < 12:
                dir = 1
            elif i >= 12 and i < 18:
                dir = 2
            else:
                dir = 3
            
            # Uses mod to determine the property at this line
            current_property = i % 6
                
            if current_property == 0:
                return_junction.get_lane().set_has_bus_lane(bool(junction_save[i]))
            elif current_property == 1:
                return_junction.get_lane().set_has_left_lane(bool(junction_save[i]))
            elif current_property == 2:
                return_junction.get_lane().set_has_bike_lane(bool(junction_save[i]))
            elif current_property == 3:
                return_junction.get_lane().set_total_standard_lanes(int(junction_save[i]))
            elif current_property == 4:
                return_junction.get_lane().set_priority(int(junction_save[i]))
            elif current_property == 5:
                return_junction.get_lane().set_has_puffin_crossing(int(junction_save[i]))
        
        return return_junction
            
