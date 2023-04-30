//store login username password to local storage on pageload

window.addEventListener("load", function () {
    localStorage.setItem("username", "Admin");
    localStorage.setItem("password", "Admin");
});
//form submission and validation
const form = document.getElementById("login-form");
form.addEventListener("submit", function (event) {
    event.preventDefault();
    //let form-data
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Perform validation and login logic here
    const validUsername = localStorage.getItem("username");
    const validPassword = localStorage.getItem("password");

    if (
        validUsername &&
        validPassword &&
        validUsername === username &&
        validPassword === password
    ) {
        var urlString = window.location.origin + "/resume/resume.html";
        window.location.replace(urlString);

    } else {
        const errorMessage = document.getElementById('error-message');
        errorMessage.innerHTML = 'Invalid username or password. Please try again.';
    }
});