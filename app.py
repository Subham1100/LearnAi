# app.py

from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route("/submit", methods=["POST"])
def submit_answers():
    answers = request.json
    return jsonify(answers)


if __name__ == "__main__":
    app.run(debug=True)
