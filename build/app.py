from flask import Flask, render_template, send_from_directory, jsonify
import Junction, InboundRoad
from flask import Response

app = Flask(__name__, 
            static_folder="CS261 Final GUI", 
            template_folder="CS261 Final GUI")

# Initialises the true model objects
junction_model = Junction.Junction()
lanes = [InboundRoad.InboundRoad()] * 4

selected_lane = None


# Reset temp model
# This creates the temporary object for editing
temp_junction_model = Junction.Junction()
temp_lanes = [InboundRoad.InboundRoad()] * 4
# 0 = north
# 1 = east
# 2 = south
# 3 = west

# Serve the main HTML page
@app.route("/")
def home():
    reset_temp_model()
    return send_from_directory(app.template_folder, "index.html")

# Changes user selection for which lane will be modified
# This creates a temporary model, and we will only set this model
# once apply has been selected
def reset_temp_model():
    # This creates the temporary object for editing
    global temp_junction_model
    global temp_lanes
    temp_junction_model = Junction.Junction()
    temp_lanes = [InboundRoad.InboundRoad()] * 4

@app.route("/edit-northbound")
def edit_northbound():
    global selected_lane
    selected_lane = 0
    reset_temp_model()
    return Response(status=204)

@app.route("/edit-eastbound")
def edit_eastbound():
    global selected_lane
    selected_lane = 1
    reset_temp_model()
    return Response(status=204)

@app.route("/edit-southbound")
def edit_southbound():
    global selected_lane
    selected_lane = 2
    reset_temp_model()
    return Response(status=204)

@app.route("/edit-westbound")
def edit_westbound():
    global selected_lane
    selected_lane = 3
    reset_temp_model()
    return Response(status=204)

# Lane modification ----------------------------------------------------------------------------

# Add lane
@app.route("/add-lane")
def add_lane():
    temp_lanes[selected_lane].increment_num_lanes()
    print("Num lanes:" + str(temp_lanes[selected_lane].get_num_lanes()))

    return Response(status=204)

# Remove lane
@app.route("/remove-lane")
def remove_lane():
    temp_lanes[selected_lane].decrement_num_lanes()
    print("Num lanes:" + str(temp_lanes[selected_lane].get_num_lanes()))
    return Response(status=204)

# Bus lane toggle
@app.route("/bus-toggle")
def bus_toggle():
    temp_lanes[selected_lane].toggle_bus_lane()
    print("Has bus lane:" + str(temp_lanes[selected_lane].has_bus_lane()))
    return Response(status=204)

# Left turn lane
@app.route("/left-toggle")
def left_toggle():
    temp_lanes[selected_lane].toggle_left_lane()
    print("Has left lane:" + str(temp_lanes[selected_lane].has_left_lane()))
    return Response(status=204)

# TODO set lane to bike lane

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
