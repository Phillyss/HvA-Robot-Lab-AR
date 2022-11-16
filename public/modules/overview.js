const popupAcceptButton = document.querySelector(".popup button");
const openTagsButton = document.querySelector("aside button.buttonblue");
const tagsPopup = document.querySelector(".popup");

function hideEl(el) {
	el.classList.add("hidden");
}

function unhideEl(el) {
	el.classList.remove("hidden");
}

// switch between AR types
function checkARType() {
	if (markerCB.checked) {
		hideEl(longCon);
		hideEl(latCon);
	} else if (gpsCB.checked) {
		unhideEl(longCon);
		unhideEl(latCon);
	}
}

popupAcceptButton.addEventListener("click", () => hideEl(tagsPopup));
openTagsButton.addEventListener("click", () => unhideEl(tagsPopup));
