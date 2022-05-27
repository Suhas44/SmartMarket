document.getElementById("credentials").innerHTML = "Welcome " + sessionStorage.getItem("username");
document.getElementById("portfolios").innerHTML = sessionStorage.getItem("portfolios");