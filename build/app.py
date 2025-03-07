from flask import Flask, send_from_directory, jsonify, request, Response
import Junction, saveFiles, copy, traceback

app = Flask(__name__, 
            static_folder="CS261 Final GUI", 
            template_folder="CS261 Final GUI")

# Initialises the true junction model 
junction_model = Junction.Junction()
selected_lane = -1

""" 
Changes that the user makes to junction arms will modify this
temporary model. Changes only affect the true model until
the user selects to apply changes
"""
temp_junction_model = Junction.Junction()

# Functions -------

# Sets the temporary model to the true model to discard changes
def reset_temp_model():
    global temp_junction_model, junction_model
    temp_junction_model = copy.deepcopy(junction_model)

# Applies changes made to the temporary model to the true model
def apply_model_changes():
    global temp_junction_model, junction_model
    junction_model = copy.deepcopy(temp_junction_model)

# Serves metrics about a junction arm, to be displayed to the user
def display_arm_metrics(direction):
    global junction_model
    reset_temp_model()

    junction_arm = junction_model.get_road(direction)
    vph_rates = junction_model.get_vph_rates()

    junction_arm = junction_model.get_road(direction)
    vph_rates = junction_model.get_vph_rates()
    junction_arm.update_junction_arm_metrics(vph_rates, junction_model, direction)

    # Gets the metrics to display
    mean_wait_mins = junction_arm.mean_wait_mins
    mean_wait_secs = junction_arm.mean_wait_secs
    max_wait_mins = junction_arm.max_wait_mins
    max_wait_secs = junction_arm.max_wait_secs
    max_queue = junction_arm.max_queue
    performance = junction_arm.performance
    environment = junction_arm.environment
    environment_rank = saveFiles.top_percent_environment(junction_arm.environment, direction)
    performance_rank = saveFiles.top_percent_performance(performance, direction)

    return mean_wait_mins, mean_wait_secs, max_wait_mins, max_wait_secs, max_queue, performance, environment, environment_rank, performance_rank

# Serves metrics about the whole junction
def display_overall_junction_metrics():
    global junction_model

    # Using the current junction model, get relevant metrics for whole model
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

    return mean_wait_mins, mean_wait_secs, max_wait_mins, max_wait_secs, max_queue, performance, environment, environment_rank, performance_rank

# Flask Routes -------

# Serve the main HTML page
@app.route("/")
def home():
    reset_temp_model()
    saveFiles.create_junction_files() # Creates the 10 junction files if they do not yet exist
    return send_from_directory(app.template_folder, "index.html")

# Metrics for whole junction
@app.route("/metrics")
def get_metrics():
    global junction_model

    mean_wait_mins, mean_wait_secs, max_wait_mins, max_wait_secs, max_queue, performance, environment, environment_rank, performance_rank = display_overall_junction_metrics()
    
    return jsonify({"mean_wait_mins": mean_wait_mins, "mean_wait_secs": mean_wait_secs, 
                    "max_wait_mins": max_wait_mins, "max_wait_secs": max_wait_secs,
                    "max_queue": max_queue, "performance": performance, "environment": environment,
                    "environment_rank": environment_rank, "performance_rank": performance_rank})

# Returns metrics to be displayed for editor menus of each junction arm

@app.route("/edit-northbound")
def edit_northbound():
    global selected_lane
    selected_lane = 0

    mean_wait_mins, mean_wait_secs, max_wait_mins, max_wait_secs, max_queue, performance, environment, environment_rank, performance_rank = display_arm_metrics(selected_lane)
    
    return jsonify({"mean_wait_mins": mean_wait_mins, "mean_wait_secs": mean_wait_secs, 
                    "max_wait_mins": max_wait_mins, "max_wait_secs": max_wait_secs,
                    "max_queue": max_queue, "performance": performance, "environment": environment,
                    "environment_rank": environment_rank, "performance_rank": performance_rank})

@app.route("/edit-eastbound")
def edit_eastbound():
    global selected_lane
    selected_lane = 1
    
    mean_wait_mins, mean_wait_secs, max_wait_mins, max_wait_secs, max_queue, performance, environment, environment_rank, performance_rank = display_arm_metrics(selected_lane)
    
    return jsonify({"mean_wait_mins": mean_wait_mins, "mean_wait_secs": mean_wait_secs, 
                    "max_wait_mins": max_wait_mins, "max_wait_secs": max_wait_secs,
                    "max_queue": max_queue, "performance": performance, "environment": environment,
                    "environment_rank": environment_rank, "performance_rank": performance_rank})

@app.route("/edit-southbound")
def edit_southbound():
    global selected_lane
    selected_lane = 2

    mean_wait_mins, mean_wait_secs, max_wait_mins, max_wait_secs, max_queue, performance, environment, environment_rank, performance_rank = display_arm_metrics(selected_lane)
    
    return jsonify({"mean_wait_mins": mean_wait_mins, "mean_wait_secs": mean_wait_secs, 
                    "max_wait_mins": max_wait_mins, "max_wait_secs": max_wait_secs,
                    "max_queue": max_queue, "performance": performance, "environment": environment,
                    "environment_rank": environment_rank, "performance_rank": performance_rank})

@app.route("/edit-westbound")
def edit_westbound():
    global selected_lane
    selected_lane = 3

    mean_wait_mins, mean_wait_secs, max_wait_mins, max_wait_secs, max_queue, performance, environment, environment_rank, performance_rank = display_arm_metrics(selected_lane)
    
    return jsonify({"mean_wait_mins": mean_wait_mins, "mean_wait_secs": mean_wait_secs, 
                    "max_wait_mins": max_wait_mins, "max_wait_secs": max_wait_secs,
                    "max_queue": max_queue, "performance": performance, "environment": environment,
                    "environment_rank": environment_rank, "performance_rank": performance_rank})

# Arm modification ----------------------------------------------------------------------------

@app.route("/add-lane")
def add_lane():
    global temp_junction_model, selected_lane
    temp_junction_model.get_road(selected_lane).increment_num_lanes()
    return Response(status=204)

@app.route("/remove-lane")
def remove_lane():
    global temp_junction_model, selected_lane
    temp_junction_model.get_road(selected_lane).decrement_num_lanes()
    return Response(status=204)

@app.route("/bus-toggle")
def bus_toggle():
    global temp_junction_model, selected_lane
    temp_junction_model.get_road(selected_lane).toggle_bus_lane() 
    return Response(status=204)

@app.route("/left-toggle")
def left_toggle():
    global temp_junction_model, selected_lane
    temp_junction_model.get_road(selected_lane).toggle_left_lane() 
    return Response(status=204)


@app.route("/bike-toggle")
def bike_toggle():
    global temp_junction_model, selected_lane
    temp_junction_model.get_road(selected_lane).toggle_bike_lane() 
    return Response(status=204)

@app.route("/puffin-toggle")
def puffin_toggle():
    global temp_junction_model, selected_lane
    temp_junction_model.get_road(selected_lane).toggle_puffin_crossing()
    has_crossing = temp_junction_model.get_road(selected_lane).has_puffin_crossing()
    return jsonify({"success": True, "has_puffin": has_crossing})

# Priority -------

@app.route("/priority-1")
def priority_1():
    global temp_junction_model, selected_lane
    temp_junction_model.get_road(selected_lane).set_priority_factor(1)
    return Response(status=204)

@app.route("/priority-2")
def priority_2():
    global temp_junction_model, selected_lane
    temp_junction_model.get_road(selected_lane).set_priority_factor(2)
    return Response(status=204)

@app.route("/priority-3")
def priority_3():
    global temp_junction_model, selected_lane
    temp_junction_model.get_road(selected_lane).set_priority_factor(3)
    return Response(status=204)

@app.route("/priority-4")
def priority_4():
    global temp_junction_model, selected_lane
    temp_junction_model.get_road(selected_lane).set_priority_factor(4)
    return Response(status=204)

# Apply changes -------

@app.route("/apply-changes", methods=["POST"])
def apply_changes():
    global selected_lane, junction_model

    # Gets the vph rate input by the user
    data = request.get_json()
    print("JSON DATA: " + str(data))
    vph_value = int(data.get('vph', 100))  # Default to 100 if not provided

    apply_model_changes()

    # Sets vph rate
    if selected_lane is not None:
        junction_model.get_road(selected_lane).vph_rate = vph_value

    mean_wait_mins, mean_wait_secs, max_wait_mins, max_wait_secs, max_queue, performance, environment, environment_rank, performance_rank = display_overall_junction_metrics()
    
    return jsonify({"mean_wait_mins": mean_wait_mins, "mean_wait_secs": mean_wait_secs, 
                    "max_wait_mins": max_wait_mins, "max_wait_secs": max_wait_secs,
                    "max_queue": max_queue, "performance": performance, "environment": environment,
                    "environment_rank": environment_rank, "performance_rank": performance_rank})

@app.route("/cancel-changes")
def cancel_changes():
    reset_temp_model()
    
    mean_wait_mins, mean_wait_secs, max_wait_mins, max_wait_secs, max_queue, performance, environment, environment_rank, performance_rank = display_overall_junction_metrics()

    return jsonify({"mean_wait_mins": mean_wait_mins, "mean_wait_secs": mean_wait_secs, 
                    "max_wait_mins": max_wait_mins, "max_wait_secs": max_wait_secs,
                    "max_queue": max_queue, "performance": performance, "environment": environment,
                    "environment_rank": environment_rank, "performance_rank": performance_rank})

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

# App setup -------

# Serve static files (CSS, JS, images)
@app.route("/<path:filename>")
def static_files(filename):
    return send_from_directory(app.static_folder, filename)

if __name__ == "__main__":
    app.run(debug=True)
