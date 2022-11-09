const form = document.querySelector("form");
const create = document.querySelector("button");
const error = document.querySelector("p");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirm");

function submit(e) {
  error.innerHTML = "";
  if (passwordInput.value !== confirmInput.value) {
    error.innerHTML = "Passwords do not match";
  }

  if (passwordInput.value < 6) {
    error.innerHTML = "Password is less than 6 characters";
  }

  if (!emailInput.value.includes("@hva.nl")) {
    error.innerHTML = "Use a HvA email";
  }

  if (error.innerHTML.length > 0) {
    e.preventDefault();
    create.style.marginTop = "42px";
    error.classList.remove("hidden");
  }
  console.log(emailInput.value);
}

form.addEventListener("submit", e => submit(e));
