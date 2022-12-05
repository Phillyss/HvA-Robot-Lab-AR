const editButton = document.querySelector(".buttonblue");
const urlArray = window.location.href.split("/");
const modelID = urlArray[urlArray.length - 1];

editButton.addEventListener("click", () => {
	window.location.href = `/models/${modelID}/edit`;
});
