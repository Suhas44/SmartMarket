if (sessionStorage.getItem("username") == null) {
    window.location.href = "/index.html";
}

document.getElementById("portfolio-form").addEventListener("submit", addToPortfolio);

async function addToPortfolio(event) {
    event.preventDefault();
    const name = document.getElementById("portfolioname").value;
    if (name == "") {
        alert("Please enter a name for your portfolio");
        return;
    }
    let user = JSON.parse(sessionStorage.getItem("user"));
    if (user.portfolios[name] == undefined) {
        user.portfolios[name] = {active: [], sold: []};
    } else {
        alert("Portfolio already exists");
        return;
    }
    sessionStorage.setItem("user", JSON.stringify(user));
    const update = await fetch('/update', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user: user,
        }),
    }).then((response) => response.json()).then((data) => {
        sessionStorage.setItem("viewingPortfolio", name);
        window.location.href = "/portfolio.html";
    });
}