// Starting position to get new records
const lastModelA = document.querySelector("main ul li:last-of-type a");
const ul = document.querySelector("main ul");
let startFrom = parseInt(lastModelA.getAttribute("href").split("s/")[1]);

//document.querySelector("h1").addEventListener("click", getData);
// load models on scroll
let nextScroll = 1008;
ul.addEventListener("scroll", e => {
	const lastModel = document.querySelector("main ul li:last-of-type");
	if (isInViewport(lastModel) && ul.scrollHeight >= nextScroll) {
		nextScroll += 732;
		getData();
	}
});

// check if element in in viewport
function isInViewport(element) {
	const rect = element.getBoundingClientRect();
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <=
			(window.innerHeight || document.documentElement.clientHeight) &&
		rect.right <= (window.innerWidth || document.documentElement.clientWidth)
	);
}

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

					// build model card
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

				// insert new model cards into the page
				document.querySelector("h1 + ul").innerHTML += html;

				// get next model id to start grabbing from db
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
