const popupAcceptButton = document.querySelector(".tagspopup button");
const openTagsButton = document.querySelector("fieldset .buttonblue");
const tagsPopup = document.querySelector(".tagspopup");

function closeTagsPopup() {
  tagsPopup.setAttribute("style", "display: none");
}

function openTagsPopup() {
  tagsPopup.setAttribute("style", "display: flex");
}

popupAcceptButton.addEventListener("click", closeTagsPopup);
openTagsButton.addEventListener("click", openTagsPopup);
