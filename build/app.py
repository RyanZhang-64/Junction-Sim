from flask import Flask, render_template, send_from_directory, jsonify
import Junction, InboundRoad
from flask import Response

app = Flask(__name__, 
            static_folder="CS261 Final GUI", 
            template_folder="CS261 Final GUI")

# Initialises the true model objects
junction_model = Junction.Junction()

# North, east, south and west junction arms
north_lane = InboundRoad.InboundRoad()
east_lane = InboundRoad.InboundRoad()
west_lane = InboundRoad.InboundRoad()
south_lane = InboundRoad.InboundRoad()

selected_lane = None

# Reset temp model
# This creates the temporary object for editing
temp_junction_model = Junction.Junction()

# North, east, south and west junction arms
temp_north_lane = InboundRoad.InboundRoad()
temp_east_lane = InboundRoad.InboundRoad()
temp_west_lane = InboundRoad.InboundRoad()
temp_south_lane = InboundRoad.InboundRoad()


# Make an array of inbound roads
# Set selected lane to an index


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
    global temp_north_lane
    global temp_south_lane
    global temp_east_lane
    global temp_west_lane

    temp_junction_model = Junction.Junction()

    # North, east, south and west junction arms
    temp_north_lane = InboundRoad.InboundRoad()
    temp_east_lane = InboundRoad.InboundRoad()
    temp_west_lane = InboundRoad.InboundRoad()
    temp_south_lane = InboundRoad.InboundRoad()

@app.route("/edit-northbound")
def edit_northbound():
    global selected_lane
    selected_lane = "north"
    reset_temp_model()
    return Response(status=204)

@app.route("/edit-eastbound")
def edit_eastbound():
    global selected_lane
    selected_lane = "east"
    reset_temp_model()
    return Response(status=204)

@app.route("/edit-southbound")
def edit_southbound():
    global selected_lane
    selected_lane = "south"
    reset_temp_model()
    return Response(status=204)

@app.route("/edit-westbound")
def edit_westbound():
    global selected_lane
    selected_lane = "west"
    reset_temp_model()
    return Response(status=204)

# Lane modification ----------------------------------------------------------------------------

# Add lane
@app.route("/add-lane")
def add_lane():
    if selected_lane == "north":
        temp_north_lane.increment_num_lanes()
        print("Num lanes:" + str(temp_north_lane.get_num_lanes()))
    elif selected_lane == "east":
        temp_east_lane.increment_num_lanes()
        print("Num lanes:" + str(temp_east_lane.get_num_lanes()))
    elif selected_lane == "south":
        temp_south_lane.increment_num_lanes()
        print("Num lanes:" + str(temp_south_lane.get_num_lanes()))
    elif selected_lane == "west":
        temp_west_lane.increment_num_lanes()
        print("Num lanes:" + str(temp_west_lane.get_num_lanes()))
    else:
        print("Error")
    return Response(status=204)

# Remove lane
@app.route("/remove-lane")
def remove_lane():
    if selected_lane == "north":
        temp_north_lane.decrement_num_lanes()
        print("Num lanes:" + str(temp_north_lane.get_num_lanes()))
    elif selected_lane == "east":
        temp_east_lane.decrement_num_lanes()
        print("Num lanes:" + str(temp_east_lane.get_num_lanes()))
    elif selected_lane == "south":
        temp_south_lane.decrement_num_lanes()
        print("Num lanes:" + str(temp_south_lane.get_num_lanes()))
    elif selected_lane == "west":
        temp_west_lane.decrement_num_lanes()
        print("Num lanes:" + str(temp_west_lane.get_num_lanes()))
    else:
        print("Error")
    return Response(status=204)

# Bus lane toggle
@app.route("/bus-toggle")
def bus_toggle():
    if selected_lane == "north":
        temp_north_lane.toggle_bus_lane()
        print("Has bus lane:" + str(temp_north_lane.has_bus_lane()))
    elif selected_lane == "east":
        temp_east_lane.toggle_bus_lane()
        print("Has bus lane:" + str(temp_east_lane.has_bus_lane()))
    elif selected_lane == "south":
        temp_south_lane.toggle_bus_lane()
        print("Has bus lane:" + str(temp_south_lane.has_bus_lane()))
    elif selected_lane == "west":
        temp_west_lane.toggle_bus_lane()
        print("Has bus lane:" + str(temp_west_lane.has_bus_lane()))
    else:
        print("Error")
    return Response(status=204)

# Left turn lane
@app.route("/left-toggle")
def left_toggle():
    if selected_lane == "north":
        temp_north_lane.toggle_left_lane()
        print("Has left lane:" + str(temp_north_lane.has_left_lane()))
    elif selected_lane == "east":
        temp_east_lane.toggle_left_lane()
        print("Has left lane:" + str(temp_east_lane.has_left_lane()))
    elif selected_lane == "south":
        temp_south_lane.toggle_left_lane()
        print("Has left lane:" + str(temp_south_lane.has_left_lane()))
    elif selected_lane == "west":
        temp_west_lane.toggle_left_lane()
        print("Has left lane:" + str(temp_west_lane.has_left_lane()))
    else:
        print("Error")
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
