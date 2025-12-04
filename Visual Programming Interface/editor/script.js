// -------------------
// Project structure
// -------------------
let projectId = window.location.hash.substring(1) || generateRandomId();

let currentProject = {
    id: projectId,
    name: "New Project",
    stage: {
        currentBackdrop: "backdrop1",
        backdrops: ["backdrop1"]
    },
    sprites: [
        {
            name: "Sprite1",
            x: 0,
            y: 0,
            direction: 90,
            costumes: ["costume1"],
            sounds: ["sound1"],
            blocks: []
        }
    ]
};

// -------------------
// Utility functions
// -------------------
function generateRandomId() {
    return Math.floor(Math.random() * 1000000).toString();
}

function updateProjectDisplay() {
    document.getElementById("stage").innerHTML = `
        <h3>Stage: ${currentProject.stage.currentBackdrop}</h3>
        <p>Sprites: ${currentProject.sprites.map(s => s.name).join(", ")}</p>
    `;
}

// -------------------
// GitHub backend functions
// -------------------
const backendUrl = "https://novablocks-save-projects.onrender.com";

async function saveProject() {
    try {
        const res = await fetch(`${backendUrl}/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(currentProject)
        });
        const data = await res.json();
        if (res.ok) alert("Project saved: " + currentProject.id);
        else alert("Error saving project: " + JSON.stringify(data));
    } catch (err) {
        console.error(err);
        alert("Failed to save project.");
    }
}

async function loadProjectFromBackend(id) {
    try {
        const res = await fetch(`${backendUrl}/load/${id}`);
        if (!res.ok) throw new Error("Project not found");
        const data = await res.json();
        currentProject = data;
        projectId = currentProject.id;
        window.location.hash = projectId;
        updateProjectDisplay();
        alert("Project loaded: " + projectId);
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

// -------------------
// Local file functions
// -------------------
function saveToComputer() {
    const blob = new Blob([JSON.stringify(currentProject)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${currentProject.id}.nbp`;
    a.click();
    URL.revokeObjectURL(a.href);
}

function loadFromComputer(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
        try {
            currentProject = JSON.parse(e.target.result);
            projectId = currentProject.id;
            window.location.hash = projectId;
            updateProjectDisplay();
            alert("Project loaded from file: " + projectId);
        } catch {
            alert("Invalid project file.");
        }
    };
    reader.readAsText(file);
}

// -------------------
// Blocks & Sprites management
// -------------------
function addSprite(name) {
    const sprite = {
        name: name || `Sprite${currentProject.sprites.length + 1}`,
        x: 0,
        y: 0,
        direction: 90,
        costumes: ["costume1"],
        sounds: ["sound1"],
        blocks: []
    };
    currentProject.sprites.push(sprite);
    updateProjectDisplay();
}

function addBlockToSprite(spriteName, block) {
    const sprite = currentProject.sprites.find(s => s.name === spriteName);
    if (!sprite) return;
    sprite.blocks.push(block);
}

function addBackdrop(name) {
    currentProject.stage.backdrops.push(name);
}

function setBackdrop(name) {
    if (currentProject.stage.backdrops.includes(name)) {
        currentProject.stage.currentBackdrop = name;
        updateProjectDisplay();
    }
}

function addCostume(spriteName, costume) {
    const sprite = currentProject.sprites.find(s => s.name === spriteName);
    if (!sprite) return;
    sprite.costumes.push(costume);
}

function addSound(spriteName, sound) {
    const sprite = currentProject.sprites.find(s => s.name === spriteName);
    if (!sprite) return;
    sprite.sounds.push(sound);
}

// -------------------
// Event listeners
// -------------------
document.getElementById("save-btn").addEventListener("click", saveProject);
document.getElementById("export-btn").addEventListener("click", saveToComputer);

const loadBtn = document.getElementById("load-btn");
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.accept = ".nbp";
fileInput.style.display = "none";
fileInput.addEventListener("change", loadFromComputer);
document.body.appendChild(fileInput);

loadBtn.addEventListener("click", () => fileInput.click());

// -------------------
// Initialize display
// -------------------
updateProjectDisplay();
