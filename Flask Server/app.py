from flask import Flask, send_from_directory
import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
WEB_DIR = os.path.join(BASE_DIR, "Visual Programming Interface")

app = Flask(__name__)

# MENÚ
@app.route("/")
def menu():
    return send_from_directory(os.path.join(WEB_DIR, "menu"), "index.html")

# EDITOR
@app.route("/editor")
def editor():
    return send_from_directory(os.path.join(WEB_DIR, "editor"), "index.html")

# ARCHIVOS ESTÁTICOS DEL MENÚ
@app.route("/menu/<path:path>")
def menu_files(path):
    return send_from_directory(os.path.join(WEB_DIR, "menu"), path)

# ARCHIVOS ESTÁTICOS DEL EDITOR
@app.route("/editor/<path:path>")
def editor_files(path):
    return send_from_directory(os.path.join(WEB_DIR, "editor"), path)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
