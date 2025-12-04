// script.js - NovaBlocks Editor

const BACKEND_URL = "https://novablocks-save-projects.onrender.com";

// Proyecto actual
let currentProject = {
    id: window.location.hash ? window.location.hash.slice(1) : generateProjectId(),
    name: "New Project",
    stage: {},
    sprites: [],
    blocks: [],
    costumes: [],
    sounds: [],
    backgrounds: []
};

// Generar un id aleatorio para nuevo proyecto
function generateProjectId() {
    return Math.floor(Math.random() * 1000000000).toString();
}

// Guardar proyecto en backend
async function saveProject() {
    try {
        const response = await fetch(`${BACKEND_URL}/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                project_id: currentProject.id,
                content: currentProject
            })
        });
        const data = await response.json();
        if (data.status === "success") {
            alert("Project saved successfully!");
        } else {
            alert("Error saving project: " + data.message);
        }
    } catch (err) {
        console.error(err);
        alert("Failed to save project");
    }
}

// Cargar proyecto desde backend
async function loadProject(projectId) {
    try {
        const response = await fetch(`${BACKEND_URL}/load/${projectId}`);
        const data = await response.json();
        if (data.status === "success") {
            currentProject = data.content;
            console.log("Project loaded:", currentProject);
            alert("Project loaded from server");
        } else {
            alert("Project not found");
        }
    } catch (err) {
        console.error(err);
        alert("Failed to load project");
    }
}

// Exportar proyecto a computadora
function exportProject() {
    const blob = new Blob([JSON.stringify(currentProject)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${currentProject.id}.nbp`;
    a.click();
}

// Botones del editor
document.getElementById("save-btn").addEventListener("click", saveProject);
document.getElementById("load-btn").addEventListener("click", () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".nbp,.json";
    fileInput.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            currentProject = JSON.parse(reader.result);
            console.log("Loaded from computer:", currentProject);
            alert("Project loaded from your computer");
        };
        reader.readAsText(file);
    };
    fileInput.click();
});
document.getElementById("export-btn").addEventListener("click", exportProject);

// Cargar proyecto si hay hash en la URL
if (window.location.hash) {
    const projectId = window.location.hash.slice(1);
    loadProject(projectId);
}
