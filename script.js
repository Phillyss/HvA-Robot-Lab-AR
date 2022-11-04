const popupAcceptButton = document.querySelector(".tagspopup button");
const openTagsButton = document.querySelector("fieldset button.buttonblue");
const tagsPopup = document.querySelector(".tagspopup");
const markerCB = document.querySelector("#marker");
const gpsCB = document.querySelector("#gps");
const longCon = document.querySelector("#longcon");
const latCon = document.querySelector("#latcon");

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
markerCB.addEventListener("change", checkARType);
gpsCB.addEventListener("change", checkARType);