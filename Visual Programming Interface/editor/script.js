// script.js

const backendURL = "https://novablocks-save-projects.onrender.com";

// Editor State
let projectID = location.hash.substring(1) || generateID();
let projectData = {
    project_id: projectID,
    sprites: [],
    backgrounds: [],
    sounds: [],
    code: []
};

const stage = document.getElementById("stage");
const blocksPanel = document.getElementById("blocks-panel");
const saveBtn = document.getElementById("save-btn");
const loadBtn = document.getElementById("load-btn");
const exportBtn = document.getElementById("export-btn");

// --- UTILS ---
function generateID() {
    return Math.floor(Math.random() * 1000000);
}

function updateURL() {
    location.hash = projectID;
}

// --- RENDER STAGE ---
function renderStage() {
    stage.innerHTML = "";
    if(projectData.backgrounds.length > 0){
        const bg = document.createElement("img");
        bg.src = projectData.backgrounds[0].src;
        bg.style.width = "100%";
        bg.style.height = "100%";
        stage.appendChild(bg);
    }
    projectData.sprites.forEach(sprite => {
        const img = document.createElement("img");
        img.src = sprite.costume;
        img.style.position = "absolute";
        img.style.left = sprite.x + "px";
        img.style.top = sprite.y + "px";
        img.style.width = sprite.width + "px";
        img.style.height = sprite.height + "px";
        stage.appendChild(img);
    });
}

// --- BLOCKS PANEL (Demo) ---
function addBlock(type) {
    projectData.code.push({ type });
    renderBlocks();
}

function renderBlocks() {
    blocksPanel.innerHTML = "";
    projectData.code.forEach((b, i) => {
        const block = document.createElement("div");
        block.className = "block";
        block.textContent = b.type;
        blocksPanel.appendChild(block);
    });
}

// --- SPRITES ---
function addSprite(name, costume) {
    projectData.sprites.push({name, costume, x: 0, y: 0, width: 100, height: 100});
    renderStage();
}

// --- BACKGROUNDS ---
function setBackground(src) {
    projectData.backgrounds = [{ src }];
    renderStage();
}

// --- SOUNDS ---
function addSound(name, src) {
    projectData.sounds.push({name, src});
}

// --- SAVE / LOAD ---
async function saveProject() {
    const resp = await fetch(`${backendURL}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData)
    });
    if(resp.ok) alert("Project saved!");
    else alert("Error saving project.");
}

async function loadProject() {
    const resp = await fetch(`${backendURL}/load/${projectID}`);
    if(resp.ok){
        const data = await resp.json();
        projectData = data;
        renderStage();
        renderBlocks();
    } else {
        console.log("No project found, starting new.");
    }
}

// --- EXPORT ---
function exportToComputer() {
    const blob = new Blob([JSON.stringify(projectData)], {type: "application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${projectID}.nbp`;
    a.click();
}

// --- EVENT LISTENERS ---
saveBtn.addEventListener("click", saveProject);
loadBtn.addEventListener("click", loadProject);
exportBtn.addEventListener("click", exportToComputer);

// --- INIT ---
updateURL();
loadProject();
renderStage();
renderBlocks();

// --- DEMO DATA ---
addSprite("Cat", "../assets/icon.png");
setBackground("../assets/new_banner.png");
addBlock("move");
addBlock("turn");
