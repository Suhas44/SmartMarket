if (sessionStorage.getItem("username") == null) {
    window.location.href = "/index.html";
}

document.getElementById("username").innerHTML = "Welcome " + sessionStorage.getItem("username");
document.getElementById("portfolios").innerHTML = sessionStorage.getItem("user");
document.getElementById("logout").addEventListener("click", () => {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("portfolios");
});