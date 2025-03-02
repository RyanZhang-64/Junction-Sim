from flask import Flask, render_template, send_from_directory, jsonify
import Junction, InboundRoad
from flask import Response
import copy
import os, math

app = Flask(__name__, 
            static_folder="CS261 Final GUI", 
            template_folder="CS261 Final GUI")

# Initialises the true model objects
junction_model = Junction.Junction()
selected_lane = None
temp_junction_model = Junction.Junction()

temp_vph_rates = [500, 500, 500, 500]

def print_junction_model():
    global junction_model
    i = 0
    for dir in junction_model.get_all_roads():
        print(i)
        print("Has bus lane: " + str(dir.is_bus_lane()))
        print("Num lanes: " + str(dir.get_total_standard_lanes()))
        i += 1

# ----------------------------------------------------------

# Serve the main HTML page
@app.route("/")
def home():
    reset_temp_model()
    return send_from_directory(app.template_folder, "index.html")

# Metrics for whole junction
@app.route("/metrics")
def get_metrics():
    global junction_model

    # Using the current junction model, get relevant metrics for whole model

    # TODO set vph_rates
    global temp_vph_rates


    junction_model.update_junction_metrics(temp_vph_rates)
    mean_wait_mins = junction_model.mean_wait_mins
    mean_wait_secs = junction_model.mean_wait_secs
    max_wait_mins = junction_model.max_wait_mins
    max_wait_secs = junction_model.max_wait_secs
    max_queue = junction_model.max_queue
    performance = junction_model.performance

    print("METRICS")
    
    return jsonify({"mean_wait_mins": mean_wait_mins, "mean_wait_secs": mean_wait_secs, 
                    "max_wait_mins": max_wait_mins, "max_wait_secs": max_wait_secs,
                    "max_queue": max_queue, 
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
    global junction_model
    direction = 0
    # direction as number 0-3
    # TODO set vph_rates
    global temp_vph_rates

    junction_arm = junction_model.get_lane("north")

    junction_arm.update_junction_arm_metrics(temp_vph_rates, junction_model, direction)
    mean_wait_mins = junction_arm.mean_wait_mins
    mean_wait_secs = junction_arm.mean_wait_secs
    max_wait_mins = junction_arm.max_wait_mins
    max_wait_secs = junction_arm.max_wait_secs
    max_queue = junction_arm.max_queue
    performance = junction_arm.performance
    
    
    return jsonify({"mean_wait_mins": mean_wait_mins, 
                    "mean_wait_secs": mean_wait_secs,
                    "max_wait_mins": max_wait_mins, 
                    "max_wait_secs": max_wait_secs,
                    "max_queue": max_queue, 
                    "performance": performance})

@app.route("/edit-eastbound")
def edit_eastbound():
    global selected_lane
    selected_lane = "east"
    reset_temp_model()
    print("East")
    
    # send JSON response of data 
    global junction_model
    direction = 1
    # direction as number 0-3
    # TODO set vph_rates
    global temp_vph_rates

    junction_arm = junction_model.get_lane("east")
    junction_arm.update_junction_arm_metrics(temp_vph_rates, junction_model, direction)
    mean_wait_mins = junction_arm.mean_wait_mins
    mean_wait_secs = junction_arm.mean_wait_secs
    max_wait_mins = junction_arm.max_wait_mins
    max_wait_secs = junction_arm.max_wait_secs
    max_queue = junction_arm.max_queue
    performance = junction_arm.performance
    
    return jsonify({"mean_wait_mins": mean_wait_mins, 
                    "mean_wait_secs": mean_wait_secs,
                    "max_wait_mins": max_wait_mins, 
                    "max_wait_secs": max_wait_secs,
                    "max_queue": max_queue, 
                    "performance": performance})

@app.route("/edit-southbound")
def edit_southbound():
    global selected_lane
    selected_lane = "south"
    reset_temp_model()
    print("South")
    
    # send JSON response of data 
    global junction_model
    direction = 2
    # direction as number 0-3
    # TODO set vph_rates
    global temp_vph_rates

    junction_arm = junction_model.get_lane("south")

    junction_arm.update_junction_arm_metrics(temp_vph_rates, junction_model, direction)
    mean_wait_mins = junction_arm.mean_wait_mins
    mean_wait_secs = junction_arm.mean_wait_secs
    max_wait_mins = junction_arm.max_wait_mins
    max_wait_secs = junction_arm.max_wait_secs
    max_queue = junction_arm.max_queue
    performance = junction_arm.performance
    
    return jsonify({"mean_wait_mins": mean_wait_mins, 
                    "mean_wait_secs": mean_wait_secs,
                    "max_wait_mins": max_wait_mins, 
                    "max_wait_secs": max_wait_secs,
                    "max_queue": max_queue, 
                    "performance": performance})

@app.route("/edit-westbound")
def edit_westbound():
    global selected_lane
    selected_lane = "west"
    reset_temp_model()
    print("West")
    
    # send JSON response of data 
    global junction_model
    direction = 3
    # direction as number 0-3
    # TODO set vph_rates
    global temp_vph_rates

    junction_arm = junction_model.get_lane("west")

    junction_arm.update_junction_arm_metrics(temp_vph_rates, junction_model, direction)
    mean_wait_mins = junction_arm.mean_wait_mins
    mean_wait_secs = junction_arm.mean_wait_secs
    max_wait_mins = junction_arm.max_wait_mins
    max_wait_secs = junction_arm.max_wait_secs
    max_queue = junction_arm.max_queue
    performance = junction_arm.performance
    
    return jsonify({"mean_wait_mins": mean_wait_mins, 
                    "mean_wait_secs": mean_wait_secs,
                    "max_wait_mins": max_wait_mins, 
                    "max_wait_secs": max_wait_secs,
                    "max_queue": max_queue, 
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
    #print_junction_model()
    apply_model_changes()
    print_junction_model()
    print("Changes applied")


    # save_current_model()
    #return Response(status=204)
    global junction_model

    # Using the current junction model, get relevant metrics for whole model

    # TODO set vph_rates
    global temp_vph_rates

    junction_model.update_junction_metrics(temp_vph_rates)
    mean_wait_mins = junction_model.mean_wait_mins
    mean_wait_secs = junction_model.mean_wait_secs
    max_wait_mins = junction_model.max_wait_mins
    max_wait_secs = junction_model.max_wait_secs
    max_queue = junction_model.max_queue
    performance = junction_model.performance
    
    return jsonify({"mean_wait_mins": mean_wait_mins, "mean_wait_secs": mean_wait_secs, 
                    "max_wait_mins": max_wait_mins, "max_wait_secs": max_wait_secs,
                    "max_queue": max_queue, 
                    "performance": performance})

@app.route("/cancel-changes")
def cancel_changes():
    reset_temp_model()
    print("Changes discarded")
    #return Response(status=204)

    global junction_model

    # Using the current junction model, get relevant metrics for whole model

    # TODO set vph_rates
    global temp_vph_rates


    junction_model.update_junction_metrics(temp_vph_rates)
    mean_wait_mins = junction_model.mean_wait_mins
    mean_wait_secs = junction_model.mean_wait_secs
    max_wait_mins = junction_model.max_wait_mins
    max_wait_secs = junction_model.max_wait_secs
    max_queue = junction_model.max_queue
    performance = junction_model.performance

    print("METRICS")
    
    return jsonify({"mean_wait_mins": mean_wait_mins, "mean_wait_secs": mean_wait_secs, 
                    "max_wait_mins": max_wait_mins, "max_wait_secs": max_wait_secs,
                    "max_queue": max_queue, 
                    "performance": performance})


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
