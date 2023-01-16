// html elements
const modelButton = document.querySelector("nav li:first-of-type button");
const infoButton = document.querySelector("nav li:nth-of-type(2) button");
const infoContainer = document.querySelector("section:first-of-type");
const circularButtons = document.querySelector("nav ul:nth-of-type(2)");

const settingsButton = document.querySelector(
	"nav ul:nth-of-type(2) button:nth-of-type(1)"
);
const settingsContainer = document.querySelector("section:nth-of-type(3)");
const pauseButton = document.querySelector(
	"section:nth-of-type(3) li:nth-of-type(1) button"
);
const resetButton = document.querySelector(
	"section:nth-of-type(3) li:nth-of-type(2) button"
);

const helpButton = document.querySelector(
	"nav ul:nth-of-type(2) li:nth-of-type(2) button"
);
const helpContainer = document.querySelector("section:nth-of-type(2)");
const helpCloseButton = document.querySelector("section button");
const markerContainer = document.getElementById("markerContainer");
const arScene = document.querySelector("a-scene");
const marker = document.querySelector("a-marker");
const model = document.querySelector("a-entity");

// states
let helpOpen = false;
let settingsOpen = false;
let infoOpen = false;

// functions
function clickModelButton() {
	if (helpOpen) {
		helpContainer.removeAttribute("id", "activeHelp");
		modelButton.classList.remove("shrink");
		circularButtons.classList.remove("hidden");
		helpOpen = false;
		return;
	}

	if (settingsOpen) {
		settingsContainer.removeAttribute("id");
		infoButton.classList.remove("selectedInfo");
		modelButton.classList.remove("shrink");
		circularButtons.classList.remove("hiddenR");
		modelButton.classList.add("selectedModel");
		settingsOpen = false;
		return;
	}

	if (modelButton.classList.contains("selectedModel")) return;
	infoButton.classList.remove("selectedInfo");
	infoContainer.removeAttribute("id");
	circularButtons.classList.remove("hidden");
	modelButton.classList.add("selectedModel");
	infoOpen = false;
}

function clickInfoButton() {
	infoOpen = true;

	if (helpOpen) {
		helpContainer.removeAttribute("id");
		modelButton.classList.remove("selectedModel");
		modelButton.classList.remove("shrink");
		infoButton.classList.add("selectedInfo");
		infoContainer.setAttribute("id", "activeInfo");
		helpOpen = false;
		return;
	}

	if (settingsOpen) {
		settingsContainer.removeAttribute("id");
		modelButton.classList.remove("selectedModel");
		modelButton.classList.remove("shrink");
		circularButtons.classList.remove("hiddenR");
		circularButtons.classList.add("hidden");
		infoButton.classList.add("selectedInfo");
		infoContainer.setAttribute("id", "activeInfo");
		settingsOpen = false;
		return;
	}

	if (infoButton.classList.contains("selectedInfo")) return;
	modelButton.classList.remove("selectedModel");
	infoButton.classList.add("selectedInfo");
	circularButtons.classList.add("hidden");
	infoContainer.setAttribute("id", "activeInfo");
}

function clickSettings() {
	settingsContainer.setAttribute("id", "activeSettings");
	modelButton.classList.add("shrink");
	circularButtons.classList.add("hiddenR");
	settingsOpen = true;
}

function clickHelp() {
	helpContainer.setAttribute("id", "activeHelp");
	modelButton.classList.add("shrink");
	circularButtons.classList.add("hidden");
	helpOpen = true;
}

function closeHelp() {
	helpContainer.removeAttribute("id", "activeHelp");
	modelButton.classList.remove("shrink");
	circularButtons.classList.remove("hidden");
	helpOpen = false;
	return;
}

function checkTap(event) {
	// open settings
	if (event.target === settingsButton) {
		clickSettings();
		return;
	}

	// close settings when AR field is tapped
	if (settingsOpen) {
		if (
			event.target !== document.querySelector("nav") &&
			event.target.tagName !== "BUTTON"
		) {
			settingsContainer.removeAttribute("id");
			infoButton.classList.remove("selectedInfo");
			modelButton.classList.remove("shrink");
			circularButtons.classList.remove("hiddenR");
			modelButton.classList.add("selectedModel");
			settingsOpen = false;
		}
		return;
	}

	if (infoOpen && event.target.tagName === "CANVAS") {
		clickModelButton();
	}
}

// Event listeners
document.addEventListener("click", event => checkTap(event));
modelButton.addEventListener("click", clickModelButton);
infoButton.addEventListener("click", clickInfoButton);
//settingsButton.addEventListener("click", clickSettings);
helpButton.addEventListener("click", clickHelp);
helpCloseButton.addEventListener("click", closeHelp);
settingsButton.addEventListener("click", clickSettings);

// hide marker example
arScene.addEventListener("markerFound", e => {
	if (markerContainer) {
		markerContainer.style.display = "none";
	}
});

// --- pause and play animations
let isPlaying = false;

// play animation when marker found
marker.addEventListener("markerFound", e => {
	isPlaying = true;
	model.setAttribute("animation-mixer", { timeScale: 1 });
});

// stop animation when marker lost
marker.addEventListener("markerLost", e => {
	isPlaying = false;
	model.removeAttribute("animation-mixer");
});

const pausePath = document.querySelector("section:nth-of-type(3) li path");
// pause/play button
pauseButton.addEventListener("click", e => {
	if (isPlaying) {
		isPlaying = false;
		model.setAttribute("animation-mixer", { timeScale: 0 });
		pausePath.setAttribute(
			"d",
			"M106.854 106.002a26.003 26.003 0 0 0-25.64 29.326c16 124 16 117.344 0 241.344a26.003 26.003 0 0 0 35.776 27.332l298-124a26.003 26.003 0 0 0 0-48.008l-298-124a26.003 26.003 0 0 0-10.136-1.994z"
		);
	} else {
		isPlaying = true;
		model.setAttribute("animation-mixer", { timeScale: 1 });
		pausePath.setAttribute(
			"d",
			"M120.16 45A20.162 20.162 0 0 0 100 65.16v381.68A20.162 20.162 0 0 0 120.16 467h65.68A20.162 20.162 0 0 0 206 446.84V65.16A20.162 20.162 0 0 0 185.84 45h-65.68zm206 0A20.162 20.162 0 0 0 306 65.16v381.68A20.162 20.162 0 0 0 326.16 467h65.68A20.162 20.162 0 0 0 412 446.84V65.16A20.162 20.162 0 0 0 391.84 45h-65.68z"
		);
	}
});

// reset rotation and scale
resetButton.addEventListener("click", e => {
	model.setAttribute("rotation", "0 0 0");
	model.setAttribute("scale", "2 2 2");
});
