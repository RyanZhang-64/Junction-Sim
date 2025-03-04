from flask import Flask, render_template, send_from_directory, jsonify
import Junction, InboundRoad
from flask import Response
import copy
import os

app = Flask(__name__, 
            static_folder="CS261 Final GUI", 
            template_folder="CS261 Final GUI")

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
            





# -------------------------------------------------------

# Initialises the true model objects
junction_model = Junction.Junction()
#lanes = [InboundRoad.InboundRoad()] * 4
selected_lane = None

# Reset temp model. This creates the temporary object for editing
temp_junction_model = Junction.Junction()
#temp_lanes = [InboundRoad.InboundRoad()] * 4
# 0 = north, 1 = east. 2 = south, 3 = west

# Serve the main HTML page
@app.route("/")
def home():
    reset_temp_model()
    return send_from_directory(app.template_folder, "index.html")

@app.route("/metrics")
def get_metrics():
    global junction_model

    # Using the current junction model, get relevant metrics for whole model

    # TODO set vph_rates
    temp_vph_rates = [100, 100, 100, 100]


    mean_wait = 2
    max_wait = 3
    max_queue = 10
    performance = junction_model.efficiency_score(temp_vph_rates)
    
    return jsonify({"mean_wait": mean_wait, 
                    "max_wait": max_wait, "max_queue": max_queue, 
                    "performance": performance})

# Changes user selection for which lane will be modified
# This creates a temporary model, and we will only set this model
# once apply has been selected
def reset_temp_model():
    global temp_junction_model, junction_model
    temp_junction_model = copy.deepcopy(junction_model)
    #temp_lanes = copy.deepcopy(lanes)

# Apply changes - will set temp model properties to true odel
def apply_model_changes():
    global temp_junction_model, junction_model
    junction_model = copy.deepcopy(temp_junction_model)
    #lanes = copy.deepcopy(temp_lanes)

@app.route("/edit-northbound")
def edit_northbound():
    global selected_lane
    selected_lane = "north"
    reset_temp_model()
    print("North")

    # send JSON response of data 
    mean_wait = 2
    max_wait = 3
    max_queue = 10
    performance = 13
    return jsonify({"mean_wait": mean_wait, 
                    "max_wait": max_wait, "max_queue": max_queue, 
                    "performance": performance})

@app.route("/edit-eastbound")
def edit_eastbound():
    global selected_lane
    selected_lane = "east"
    reset_temp_model()
    print("East")
    
    # send JSON response of data 
    mean_wait = 2
    max_wait = 3
    max_queue = 10
    performance = 13
    return jsonify({"mean_wait": mean_wait, 
                    "max_wait": max_wait, "max_queue": max_queue, 
                    "performance": performance})

@app.route("/edit-southbound")
def edit_southbound():
    global selected_lane
    selected_lane = "south"
    reset_temp_model()
    print("South")
    
    # send JSON response of data 
    mean_wait = 2
    max_wait = 3
    max_queue = 10
    performance = 13
    return jsonify({"mean_wait": mean_wait, 
                    "max_wait": max_wait, "max_queue": max_queue, 
                    "performance": performance})

@app.route("/edit-westbound")
def edit_westbound():
    global selected_lane
    selected_lane = "west"
    reset_temp_model()
    print("West")
    
    # send JSON response of data 
    mean_wait = 2
    max_wait = 3
    max_queue = 10
    performance = 13
    return jsonify({"mean_wait": mean_wait, 
                    "max_wait": max_wait, "max_queue": max_queue, 
                    "performance": performance})

# Lane modification ----------------------------------------------------------------------------

# Add lane
@app.route("/add-lane")
def add_lane():
    global temp_junction_model, selected_lane
    temp_junction_model.get_lane(selected_lane).increment_num_lanes()

    print("Num lanes:" + str(temp_junction_model.get_lane(selected_lane).get_num_lanes()))
    return Response(status=204)

# Remove lane
@app.route("/remove-lane")
def remove_lane():
    global temp_junction_model, selected_lane
    temp_junction_model.get_lane(selected_lane).decrement_num_lanes()
    print("Num lanes:" + str(temp_junction_model.get_lane(selected_lane).get_num_lanes()))
    return Response(status=204)

# Bus lane toggle
@app.route("/bus-toggle")
def bus_toggle():
    global temp_junction_model, selected_lane
    temp_junction_model.get_lane(selected_lane).toggle_bus_lane()
    print("Has bus lane:" + str(temp_junction_model.get_lane(selected_lane).is_bus_lane()))
    return Response(status=204)

# Left turn lane
@app.route("/left-toggle")
def left_toggle():
    global temp_junction_model, selected_lane
    temp_junction_model.get_lane(selected_lane).toggle_left_lane()
    print("Has left lane:" + str(temp_junction_model.get_lane(selected_lane).is_left_lane()))
    return Response(status=204)

# TODO bike lane toggle

# Puffin toggle
@app.route("/puffin-toggle")
def puffin_toggle():
    global temp_junction_model, selected_lane
    temp_junction_model.get_lane(selected_lane).toggle_puffin_crossing()
    print("Has puffin crossing: " + str(temp_junction_model.get_lane(selected_lane).has_puffin_crossing()))
    return Response(status=204)

# Priority --------------------------------------------------------------------------------------------

@app.route("/priority-1")
def priority_1():
    global temp_junction_model, selected_lane
    temp_junction_model.get_lane(selected_lane).set_priority_factor(1)
    print("Lane now has priority: " + str(temp_junction_model.get_lane(selected_lane).get_priority_factor()))
    return Response(status=204)

@app.route("/priority-2")
def priority_2():
    global temp_junction_model, selected_lane
    temp_junction_model.get_lane(selected_lane).set_priority_factor(2)
    print("Lane now has priority: " + str(temp_junction_model.get_lane(selected_lane).get_priority_factor()))
    return Response(status=204)

@app.route("/priority-3")
def priority_3():
    global temp_junction_model, selected_lane
    temp_junction_model.get_lane(selected_lane).set_priority_factor(3)
    print("Lane now has priority: " + str(temp_junction_model.get_lane(selected_lane).get_priority_factor()))
    return Response(status=204)

@app.route("/priority-4")
def priority_4():
    global temp_junction_model, selected_lane
    temp_junction_model.get_lane(selected_lane).set_priority_factor(4)
    print("Lane now has priority: " + str(temp_junction_model.get_lane(selected_lane).get_priority_factor()))
    return Response(status=204)

# Model changes ---------------------------------------------------------------------------
@app.route("/apply-changes")
def apply_changes():
    apply_model_changes()
    print("Changes applied")


    save_current_model()
    return Response(status=204)

@app.route("/cancel-changes")
def cancel_changes():
    reset_temp_model()
    print("Changes discarded")
    return Response(status=204)


# Other -----------------------------------------------------------------------------------------------

# Serve static files (CSS, JS, images)
@app.route("/<path:filename>")
def static_files(filename):
    return send_from_directory(app.static_folder, filename)

# Example API route (modify as needed)
@app.route("/api/data")
def get_data():
    return jsonify({"message": "Hello from Flask!"})

@app.route("/api/button-click")
def button_click():
    print("Compare button was clicked")
    return jsonify({"message": "Button was clicked!"})  # JSON response



if __name__ == "__main__":
    app.run(debug=True)
