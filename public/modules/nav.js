const accountButton = document.querySelector("nav button");
const svg = document.querySelector("nav svg");
const path = document.querySelector("nav path");
const accountPopup = document.querySelector("nav div");
let popup = false;

document.addEventListener("click", e => {
	if ((e.target === svg) & !popup) {
		accountPopup.classList.remove("hidden");
		popup = true;
	} else if ((e.target === path) & !popup) {
		accountPopup.classList.remove("hidden");
		popup = true;
	} else {
		if (e.target !== accountPopup) {
			accountPopup.classList.add("hidden");
			popup = false;
		}
	}
});
