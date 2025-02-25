from flask import Flask, render_template, send_from_directory, jsonify
import Junction, InboundRoad

app = Flask(__name__, 
            static_folder="CS261 Final GUI", 
            template_folder="CS261 Final GUI")

# Serve the main HTML page
@app.route("/")
def home():
    # Initialises the model objects
    junctionModel = Junction.Junction()

    # North, east, south and west junction arms
    northLane = InboundRoad.InboundRoad()
    eastLane = InboundRoad.InboundRoad()
    westLane = InboundRoad.InboundRoad()
    southLane = InboundRoad.InboundRoad()

    selectedLane = None

    return send_from_directory(app.template_folder, "index.html")

# Changes user selection for which lane will be modified
# This creates a temporary model, and we will only set this model
# once apply has been selected



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
