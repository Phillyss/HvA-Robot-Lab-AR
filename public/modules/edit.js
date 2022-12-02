const thumbnailInput = document.getElementById("thumbnail");
const thumbnailLabel = document.querySelector("#thumbnailcon label");
const modelInput = document.getElementById("model");
const popupAcceptButton = document.querySelector(".tagspopup button");
const openTagsButton = document.querySelector("fieldset button.buttonblue");
const tagsPopup = document.querySelector(".tagspopup");
const tagsInput = document.getElementById("tags");
const allTags = document.querySelectorAll(".tagspopup input");
const markerCB = document.querySelector("#marker");
const gpsCB = document.querySelector("#gps");
const longCon = document.querySelector("#longcon");
const latCon = document.querySelector("#latcon");
const deletePopup = document.querySelector(".delpopup");
const deleteInput = document.querySelector(".delpopup input");
const cancelDeleteButton = document.querySelector(".delpopup .buttonblue");
const deleteButtonMain = document.querySelector("#buttoncon button");
const submitDeleteButton = document.querySelector(".delpopup button");
const cancelEditButton = document.querySelector(
	"#buttoncon button:nth-of-type(2)"
);

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

// hide/unhide coordinates on page load
checkARType();

// check tags on page load
const tagsArray = tagsInput.value.split(", ");
tagsArray.forEach(tag => {
	const input = document.querySelector(`input[value="${tag}"]`);
	input.checked = "true";
});

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

function setThumbnailBackground() {
	const file = this.files[0];
	const reader = new FileReader();

	reader.onloadend = () => {
		thumbnailLabel.style.backgroundImage = "url(" + reader.result + ")";
	};
	if (file) reader.readAsDataURL(file);
}

function updateModelName() {
	const file = this.files[0];
	document.querySelector("fieldset p").innerHTML = file.name;
}

// get model id
const urlArray = window.location.href.split("/");
const modelID = urlArray[urlArray.length - 2];

thumbnailInput.addEventListener("change", setThumbnailBackground, false);
modelInput.addEventListener("change", updateModelName, false);
openTagsButton.addEventListener("click", () => unhideEl(tagsPopup));
markerCB.addEventListener("change", checkARType);
gpsCB.addEventListener("change", checkARType);

deleteButtonMain.addEventListener("click", () => {
	deleteInput.value = "true";
	unhideEl(deletePopup);
});

//submitDeleteButton.addEventListener("click");

cancelDeleteButton.addEventListener("click", () => {
	deleteInput.value = "false";
	hideEl(deletePopup);
});

popupAcceptButton.addEventListener("click", () => {
	setTags();
	hideEl(tagsPopup);
});

cancelEditButton.addEventListener("click", () => {
	window.location.href = `/models/${modelID}`;
});
