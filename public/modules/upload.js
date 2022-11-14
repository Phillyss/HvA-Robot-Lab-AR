const popupAcceptButton = document.querySelector(".popup button");
const openTagsButton = document.querySelector("fieldset button.buttonblue");
const tagsPopup = document.querySelector(".popup");
const tagsInput = document.getElementById("tags");
const allTags = document.querySelectorAll(".tagspopup input");
const markerCB = document.querySelector("#marker");
const gpsCB = document.querySelector("#gps");
const longCon = document.querySelector("#longcon");
const latCon = document.querySelector("#latcon");
const cancelButton = document.querySelector(".delpopup .buttonblue");

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

function setTags() {
	tagsInput.value = "";
	let newTags = "";
	allTags.forEach(t => {
		if (t.checked) {
			if (newTags.length === 0) {
				newTags = t.value;
			} else {
				newTags = newTags.concat(", ", t.value);
			}
		}
	});
	tagsInput.value = newTags;
}

popupAcceptButton.addEventListener("click", () => {
	setTags();
	hideEl(tagsPopup);
});
openTagsButton.addEventListener("click", () => unhideEl(tagsPopup));
markerCB.addEventListener("change", checkARType);
gpsCB.addEventListener("change", checkARType);
