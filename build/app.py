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
    try:
        with open(filename, "r") as file:
            lines = file.readlines()
            if len(lines) >= 120 and lines[119].strip():
                print("Line 120 contains content.")
            else:
                print("Line 120 is empty or does not exist.")
    except FileNotFoundError:
        print("File not found.")

# Saves info about current junction to file
def save_current_model():
    global junction_model
    if not full_num_saves():
        print(junction_model.efficiency_score([100, 100, 100, 100]))
        print("not full")
    else:
        print("Full save files")
    
    

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
    return Response(status=204)

@app.route("/edit-eastbound")
def edit_eastbound():
    global selected_lane
    selected_lane = "east"
    reset_temp_model()
    print("East")
    return Response(status=204)

@app.route("/edit-southbound")
def edit_southbound():
    global selected_lane
    selected_lane = "south"
    reset_temp_model()
    print("South")
    return Response(status=204)

@app.route("/edit-westbound")
def edit_westbound():
    global selected_lane
    selected_lane = "west"
    reset_temp_model()
    print("West")
    return Response(status=204)

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
    print("Has bus lane:" + str(temp_junction_model.get_lane(selected_lane).bus_lane()))
    return Response(status=204)

# Left turn lane
@app.route("/left-toggle")
def left_toggle():
    global temp_junction_model, selected_lane
    temp_junction_model.get_lane(selected_lane).toggle_left_lane()
    print("Has left lane:" + str(temp_junction_model.get_lane(selected_lane).left_lane()))
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
