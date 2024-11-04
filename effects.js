document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("header");
    const headerText = document.querySelector("header h1");

    const canvas = document.createElement("canvas");
    canvas.width = header.offsetWidth;
    canvas.height = header.offsetHeight;

    header.style.position = "relative"; 
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    header.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "blue");   
    gradient.addColorStop(1, "purple");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    headerText.style.color = "white";
    headerText.style.position = "relative";
    headerText.style.zIndex = "1"; 
});

const shootSound = new Audio('assets/weapon.mp3');

document.addEventListener("keydown", (event) => {
    if (event.key === "g" || event.key === "G") { 
        shootSound.currentTime = 0; 
        shootSound.play(); 
    }
});