// html elements
const modelButton = document.querySelector("nav li:first-of-type button");
const infoButton = document.querySelector("nav li:nth-of-type(2) button");
const infoContainer = document.querySelector("section:first-of-type");
const circularButtons = document.querySelector("nav ul:nth-of-type(2)");
const settingsButton = document.querySelector(
	"nav ul:nth-of-type(2) button:nth-of-type(1)"
);
const settingsContainer = document.querySelector("section:nth-of-type(3)");
const helpButton = document.querySelector(
	"nav ul:nth-of-type(2) li:nth-of-type(2) button"
);
const helpContainer = document.querySelector("section:nth-of-type(2)");
const helpCloseButton = document.querySelector("section button");

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
		console.log(event.target);
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

// autoplay video
// if (document.querySelector("video")) {
//   const video = document.querySelector("video");
//   video.play();
// }

// Event listeners
document.addEventListener("click", event => checkTap(event));
modelButton.addEventListener("click", clickModelButton);
infoButton.addEventListener("click", clickInfoButton);
//settingsButton.addEventListener("click", clickSettings);
helpButton.addEventListener("click", clickHelp);
helpCloseButton.addEventListener("click", closeHelp);
settingsButton.addEventListener("click", clickSettings);
