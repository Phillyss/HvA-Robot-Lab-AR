// Starting position to get new records
const lastModelA = document.querySelector("main ul li:last-of-type a");
let startFrom = parseInt(lastModelA.getAttribute("href").split("s/")[1]);
console.log(startFrom);

// window.addEventListener("load", function () {
// 	// Calling the function on page load
// 	getData();
// 	getData();
// });

document.querySelector("h1").addEventListener("click", getData);

// This function will be called every time a button pressed
function getData() {
	// Creating a built-in AJAX object
	var ajax = new XMLHttpRequest();

	// tell the method and URL of request
	ajax.open("POST", "http://localhost:3000/load-more", true);

	// Detecting request state change
	ajax.onreadystatechange = function () {
		// Called when the response is successfully received
		if (this.readyState == 4) {
			if (this.status == 200) {
				// For debugging purpose only
				// console.log(this.responseText);

				// Converting JSON string to Javasript array
				const data = JSON.parse(this.responseText);
				var html = "";

				// Appending all returned data in a variable called html
				for (let a = 0; a < data.length; a++) {
					// get tags for model
					let tags = data[0].tags[0];
					for (let i = 1; i < data[a].tags.length; i++) {
						tags = tags.concat(", ", data[a].tags[i]);
					}

					html += `<li>
						<a href="/models/${data[a].modelid}">
							<div>
								<img
									src="gltfModels/${data[a].modelid}/${data[a].thumbnail}"
									alt="thumbnail"
								/>
							</div>
							<div>
								<h2>${data[a].name}</h2>
							</div>
							<div>
								<p>${data[a].description}</p>
							</div>
							<div>
								<p>
									${tags}
								</p>
								<p>${data[a].username}</p>
							</div>
						</a>
					</li>`;
				}

				// Appending the data below old data in <tbody> tag
				document.querySelector("h1 + ul").innerHTML += html;

				// Incrementing the offset so you can get next records when that button is clicked
				startFrom = document
					.querySelector("main ul li:last-of-type a")
					.getAttribute("href")
					.split("s/")[1];
			}
		}
	};

	var formData = new FormData();
	formData.append("startFrom", startFrom);

	// Actually sending the request
	ajax.send(formData);
}
