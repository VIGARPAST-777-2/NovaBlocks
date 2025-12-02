from flask import Flask, send_from_directory
import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
VPI_DIR = os.path.join(BASE_DIR, "Visual Programming Interface")

app = Flask(__name__, static_folder=None)

@app.route("/")
def root():
    return send_from_directory(os.path.join(VPI_DIR, "menu"), "index.html")

@app.route("/Visual Programming Interface/<path:path>")
def serve_vpi(path):
    return send_from_directory(VPI_DIR, path)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
