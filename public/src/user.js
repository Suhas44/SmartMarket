if (sessionStorage.getItem("username") == null) {
    window.location.href = "/index.html";
}

document.getElementById("username").innerHTML = "Welcome " + sessionStorage.getItem("username");
document.getElementById("portfolios").innerHTML = makePortfoliosButtons(JSON.parse(sessionStorage.getItem("user")).portfolios);
document.getElementById("logout").addEventListener("click", () => {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("portfolios");
});

function makePortfoliosButtons(portfolios) {
    let html = "";
    for (let key in portfolios) {
        html += "<button class='portfolio-button'>" + key + "</button> &nbsp; &nbsp;";
    }
    return html + "<br> <br>";
}

const buttons = document.querySelectorAll('.portfolio-button');
buttons.forEach(button => {
  button.addEventListener('click', function handleClick(event) {
    sessionStorage.setItem("viewingPortfolio", event.target.innerHTML);
    window.location.href = "/portfolio.html";
  });
});