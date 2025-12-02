from flask import Flask, send_from_directory
import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
WEB_DIR = os.path.join(BASE_DIR, "Visual Programming Interface")

app = Flask(__name__)

@app.route("/")
def menu():
    return send_from_directory(os.path.join(WEB_DIR, "menu"), "index.html")

@app.route("/editor")
def editor():
    return send_from_directory(os.path.join(WEB_DIR, "editor"), "index.html")

@app.route("/assets/<path:path>")
def assets(path):
    return send_from_directory(os.path.join(WEB_DIR, "assets"), path)

@app.route("/editor/assets/<path:path>")
def editor_assets(path):
    return send_from_directory(os.path.join(WEB_DIR, "editor/assets"), path)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
