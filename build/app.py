# connecting the front and back end

from flask import Flask, request, jsonify
import Junction, leftTurn

app = Flask(__name__)

@app.route('/python-test', methods=['POST'])
def run_python():
    """
    data = request.json
    result = data["number"] * 2  # Example function
    return jsonify({"result": result})
    """
    print("test")
    return jsonify({"message": "Python function executed"})

if __name__ == '__main__':
    app.run(debug=True)