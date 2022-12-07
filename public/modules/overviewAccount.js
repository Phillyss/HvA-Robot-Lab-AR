// overview/account
const popupAcceptButton = document.querySelector(".popup button");
const openTagsButton = document.querySelector("aside button.buttonblue");
const tagsPopup = document.querySelector(".popup");

// account
const deleteButton = document.querySelector("h1 + button");
const deletePopup = document.querySelector(".delpopup");
const deletePageOne = document.querySelector(".delpopup div:first-of-type");
const deletePageTwo = document.querySelector(".delpopup div:nth-of-type(2)");
const cancelButtonTwo = document.querySelector(".delpopup div form + button");
const deleteButtonTwo = document.querySelector(".delpopup div form button");
const deleteForm = document.querySelector(".delpopup form");
const emailInput = document.querySelector(".delpopup input[type=text]");
const hiddenInput = document.querySelector(".delpopup input[type=hidden]");

const cancelButtonOne = document.querySelector(
	".delpopup div:nth-of-type(1) button:last-of-type"
);
const deleteButtonOne = document.querySelector(
	".delpopup div:nth-of-type(1) button:first-of-type"
);

function hideEl(el) {
	el.classList.add("hidden");
}

function unhideEl(el) {
	el.classList.remove("hidden");
}

popupAcceptButton.addEventListener("click", () => hideEl(tagsPopup));
openTagsButton.addEventListener("click", () => unhideEl(tagsPopup));

// account page
if (deleteButton) {
	deleteButton.addEventListener("click", () => {
		//deleteInput.value = "true";
		unhideEl(deletePopup);
	});

	deleteButtonOne.addEventListener("click", () => {
		hideEl(deletePageOne);
		unhideEl(deletePageTwo);
	});

	cancelButtonOne.addEventListener("click", () => {
		//deleteInput.value = "false";
		hideEl(deletePopup);
	});

	cancelButtonTwo.addEventListener("click", () => {
		//deleteInput.value = "false";
		hideEl(deletePopup);
		hideEl(deletePageTwo);
		unhideEl(deletePageOne);
	});
}

deleteForm.addEventListener("submit", e => {
	console.log(emailInput.value);
	console.log(hiddenInput.value);
	if (emailInput.value !== hiddenInput.value) {
		emailInput.style.borderColor = "#ff2e60";
		e.preventDefault();
	}
});
