from flask import Flask, render_template, send_from_directory, jsonify, request
import Junction, InboundRoad, saveFiles
from flask import Response
import copy, os, math
import traceback

app = Flask(__name__, 
            static_folder="CS261 Final GUI", 
            template_folder="CS261 Final GUI")

# Initialises the true model objects
junction_model = Junction.Junction()
selected_lane = None
temp_junction_model = Junction.Junction()



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
    saveFiles.create_junction_files()
    return send_from_directory(app.template_folder, "index.html")

# Metrics for whole junction
@app.route("/metrics")
def get_metrics():
    global junction_model

    # Using the current junction model, get relevant metrics for whole model

    # TODO set vph_rates



    junction_model.update_junction_metrics()
    mean_wait_mins = junction_model.mean_wait_mins
    mean_wait_secs = junction_model.mean_wait_secs
    max_wait_mins = junction_model.max_wait_mins
    max_wait_secs = junction_model.max_wait_secs
    max_queue = junction_model.max_queue
    performance = junction_model.performance
    environment = junction_model.environment
    environment_rank = saveFiles.top_percent_environment(environment, -1)
    performance_rank = saveFiles.top_percent_performance(performance, -1)
    
    return jsonify({"mean_wait_mins": mean_wait_mins, "mean_wait_secs": mean_wait_secs, 
                    "max_wait_mins": max_wait_mins, "max_wait_secs": max_wait_secs,
                    "max_queue": max_queue, 
                    "performance": performance,
                    "environment": environment,
                    "environment_rank": environment_rank,
                    "performance_rank": performance_rank})

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


    junction_arm = junction_model.get_lane("north")
    vph_rates = junction_model.get_vph_rates()

    junction_arm.update_junction_arm_metrics(vph_rates, junction_model, direction)
    mean_wait_mins = junction_arm.mean_wait_mins
    mean_wait_secs = junction_arm.mean_wait_secs
    max_wait_mins = junction_arm.max_wait_mins
    max_wait_secs = junction_arm.max_wait_secs
    max_queue = junction_arm.max_queue
    performance = junction_arm.performance
    
    environment = junction_arm.environment

    environment_rank = saveFiles.top_percent_environment(junction_arm.environment, direction)

    performance_rank = saveFiles.top_percent_performance(performance, direction)
    
    return jsonify({"mean_wait_mins": mean_wait_mins, 
                    "mean_wait_secs": mean_wait_secs,
                    "max_wait_mins": max_wait_mins, 
                    "max_wait_secs": max_wait_secs,
                    "max_queue": max_queue, 
                    "performance": performance,
                    "environment": environment,
                    "environment_rank": environment_rank, 
                    "performance_rank": performance_rank})

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


    junction_arm = junction_model.get_lane("east")
    vph_rates = junction_model.get_vph_rates()

    junction_arm.update_junction_arm_metrics(vph_rates, junction_model, direction)
    mean_wait_mins = junction_arm.mean_wait_mins
    mean_wait_secs = junction_arm.mean_wait_secs
    max_wait_mins = junction_arm.max_wait_mins
    max_wait_secs = junction_arm.max_wait_secs
    max_queue = junction_arm.max_queue
    performance = junction_arm.performance
    
    environment = junction_arm.environment
    
    environment_rank = saveFiles.top_percent_environment(junction_arm.environment, direction)
    performance_rank = saveFiles.top_percent_performance(performance, direction)
    
    return jsonify({"mean_wait_mins": mean_wait_mins, 
                    "mean_wait_secs": mean_wait_secs,
                    "max_wait_mins": max_wait_mins, 
                    "max_wait_secs": max_wait_secs,
                    "max_queue": max_queue, 
                    "performance": performance,
                    "environment": environment,
                    "environment_rank": environment_rank, 
                    "performance_rank": performance_rank})

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


    junction_arm = junction_model.get_lane("south")

    vph_rates = junction_model.get_vph_rates()

    junction_arm.update_junction_arm_metrics(vph_rates, junction_model, direction)
    mean_wait_mins = junction_arm.mean_wait_mins
    mean_wait_secs = junction_arm.mean_wait_secs
    max_wait_mins = junction_arm.max_wait_mins
    max_wait_secs = junction_arm.max_wait_secs
    max_queue = junction_arm.max_queue
    performance = junction_arm.performance
    
    environment = junction_arm.environment
    
    environment_rank = saveFiles.top_percent_environment(junction_arm.environment, direction)
    
    performance_rank = saveFiles.top_percent_performance(performance, direction)
    
    return jsonify({"mean_wait_mins": mean_wait_mins, 
                    "mean_wait_secs": mean_wait_secs,
                    "max_wait_mins": max_wait_mins, 
                    "max_wait_secs": max_wait_secs,
                    "max_queue": max_queue, 
                    "performance": performance,
                    "environment": environment,
                    "environment_rank": environment_rank, 
                    "performance_rank": performance_rank})

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


    junction_arm = junction_model.get_lane("west")

    vph_rates = junction_model.get_vph_rates()

    junction_arm.update_junction_arm_metrics(vph_rates, junction_model, direction)
    mean_wait_mins = junction_arm.mean_wait_mins
    mean_wait_secs = junction_arm.mean_wait_secs
    max_wait_mins = junction_arm.max_wait_mins
    max_wait_secs = junction_arm.max_wait_secs
    max_queue = junction_arm.max_queue
    performance = junction_arm.performance
    environment = junction_arm.environment
    environment_rank = saveFiles.top_percent_environment(environment, direction)
    
    performance_rank = saveFiles.top_percent_performance(performance, direction)
    
    return jsonify({"mean_wait_mins": mean_wait_mins, 
                    "mean_wait_secs": mean_wait_secs,
                    "max_wait_mins": max_wait_mins, 
                    "max_wait_secs": max_wait_secs,
                    "max_queue": max_queue, 
                    "performance": performance,
                    "environment": environment,
                    "environment_rank": environment_rank, 
                    "performance_rank": performance_rank})

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
    # Should turn off left and bike
    if temp_junction_model.get_lane(selected_lane).has_bus_lane:
        temp_junction_model.get_lane(selected_lane).has_bike_lane = False
        temp_junction_model.get_lane(selected_lane).has_left_lane = False
    return Response(status=204)

# Left turn lane
@app.route("/left-toggle")
def left_toggle():
    global temp_junction_model, selected_lane
    temp_junction_model.get_lane(selected_lane).toggle_left_lane()
    print("Has left lane:" + str(temp_junction_model.get_lane(selected_lane).is_left_lane()))
    if temp_junction_model.get_lane(selected_lane).has_left_lane:
        temp_junction_model.get_lane(selected_lane).has_bike_lane = False
        temp_junction_model.get_lane(selected_lane).has_bus_lane = False
    return Response(status=204)

# TODO bike lane toggle
@app.route("/bike-toggle")
def bike_toggle():
    global temp_junction_model, selected_lane
    temp_junction_model.get_lane(selected_lane).toggle_bike_lane()
    print("Has bike lane:" + str(temp_junction_model.get_lane(selected_lane).is_bike_lane()))
    if temp_junction_model.get_lane(selected_lane).has_bike_lane:
        temp_junction_model.get_lane(selected_lane).has_left_lane = False
        temp_junction_model.get_lane(selected_lane).has_bus_lane = False
    return Response(status=204)

# Puffin toggle
@app.route("/puffin-toggle")
def puffin_toggle():
    global temp_junction_model, selected_lane
    temp_junction_model.get_lane(selected_lane).toggle_puffin_crossing()
    has_crossing = temp_junction_model.get_lane(selected_lane).has_puffin_crossing()
    print("Has puffin crossing: " + str(has_crossing))
    return jsonify({"success": True, "has_puffin": has_crossing})

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
@app.route("/apply-changes", methods=["POST"])
def apply_changes():
    #print_junction_model()
    
    print_junction_model()
    print("Changes applied")

    # Using the current junction model, get relevant metrics for whole model

    # TODO set vph_rates
    global selected_lane, junction_model

    data = request.get_json()
    print("JSON DATA: " + str(data))
    vph_value = int(data.get('vph', 100))  # Default to 100 if not provided

    apply_model_changes()

    if selected_lane is not None:
        junction_model.get_lane(selected_lane).vph_rate = vph_value

    junction_model.update_junction_metrics()

    mean_wait_mins = junction_model.mean_wait_mins
    mean_wait_secs = junction_model.mean_wait_secs
    max_wait_mins = junction_model.max_wait_mins
    max_wait_secs = junction_model.max_wait_secs
    max_queue = junction_model.max_queue
    performance = junction_model.performance
    environment = junction_model.environment

    

    # TODO save to file
    #saveFiles.save_junction_to_file(junction_model)
    #saveFiles.create_model_from_save(1)
    
    environment_rank = saveFiles.top_percent_environment(environment, -1)
    performance_rank = saveFiles.top_percent_performance(performance, -1)

    print("VPH RATE: " + str(junction_model.get_lane(selected_lane).vph_rate))
    
    return jsonify({"mean_wait_mins": mean_wait_mins, "mean_wait_secs": mean_wait_secs, 
                    "max_wait_mins": max_wait_mins, "max_wait_secs": max_wait_secs,
                    "max_queue": max_queue, 
                    "performance": performance,
                    "environment": environment,
                    "environment_rank": environment_rank,
                    "performance_rank": performance_rank})

@app.route("/cancel-changes")
def cancel_changes():
    reset_temp_model()
    print("Changes discarded")
    #return Response(status=204)

    global junction_model

    # Using the current junction model, get relevant metrics for whole model

    # TODO set vph_rates


    junction_model.update_junction_metrics()
    mean_wait_mins = junction_model.mean_wait_mins
    mean_wait_secs = junction_model.mean_wait_secs
    max_wait_mins = junction_model.max_wait_mins
    max_wait_secs = junction_model.max_wait_secs
    max_queue = junction_model.max_queue
    performance = junction_model.performance
    environment = junction_model.environment

    print("METRICS")
    
    environment_rank = saveFiles.top_percent_environment(environment, -1)
    performance_rank = saveFiles.top_percent_performance(performance, -1)
    
    return jsonify({"mean_wait_mins": mean_wait_mins, "mean_wait_secs": mean_wait_secs, 
                    "max_wait_mins": max_wait_mins, "max_wait_secs": max_wait_secs,
                    "max_queue": max_queue, 
                    "performance": performance,
                    "environment": environment,
                    "environment_rank": environment_rank,
                    "performance_rank": performance_rank})

# Save files ------------------------------------------------------------------------------------

@app.route("/save-junction", methods=["POST"])
def save_junction():
    try:
        print("=== SAVE JUNCTION ROUTE CALLED ===")
        global junction_model
        print(f"Junction model exists: {junction_model is not None}")
        
        # Check if free slot exists
        has_free_slot = saveFiles.free_slot_exists()
        print(f"Free slot exists: {has_free_slot}")
        
        # Try to save
        success = saveFiles.save_junction_to_file(junction_model)
        print(f"Save result: {success}")
        
        result = "success" if success else "fail"
        print(f"Returning result: {result}")
        return jsonify({"result": result})
    except Exception as e:
        print(f"Exception during save: {str(e)}")
        traceback.print_exc()
        return jsonify({"result": "error", "message": str(e)})

@app.route("/overwrite-save", methods=["GET"])  # Note: This is currently GET in flaskConnection.js
def overwrite_save():
    try:
        print("=== OVERWRITE SAVE ROUTE CALLED ===")
        global junction_model
        print(f"Junction model exists: {junction_model is not None}")
        
        # Find oldest save or use save number 1
        save_number = 1  # Current implementation uses a hardcoded value
        print(f"Using save number: {save_number}")
        
        # Try to overwrite
        overwrite_result = saveFiles.overwrite_file(junction_model, save_number)
        print(f"Overwrite result: {overwrite_result}")
        
        if overwrite_result:
            return jsonify({"result": "success"})
        else:
            print("Overwrite operation failed")
            return jsonify({"result": "fail", "message": "Overwrite failed"})
    except Exception as e:
        print(f"Exception during overwrite: {str(e)}")
        traceback.print_exc()
        return jsonify({"result": "error", "message": str(e)})



# Junction comparison -------------------------------------------------------------------------------

# Given a direction, return the metrics from all stored in that direction


# Give metrics of overall junction stored on file
"""
@app.route("/overwrite-save", methods=["POST"])
def overwrite_save():
    global junction_model

    # Save file number
    data = request.get_json()
    print("JSON DATA: " + str(data))
    save_number = int(data.get('save_file', 1))  # Default to 1

    saveFiles.overwrite_file(junction_model, save_number)
    return Response(status=204)
"""


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
