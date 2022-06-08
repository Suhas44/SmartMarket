if (sessionStorage.getItem("username") == null) {
    window.location.href = "/index.html";
}

const tickerform = document.getElementById("ticker-form");
tickerform.addEventListener("submit", searchTicker);

async function searchTicker(event) {
    event.preventDefault();
    const ticker = document.getElementById("ticker").value.toUpperCase();
    const result = await fetch('/search', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ticker: ticker,
        }),
    }).then((response) => response.json()).then((price) => {
            price = Number(price).toFixed(2);
            let sharenumber = document.getElementById("sharenumber").value;
            let portfolioname = document.getElementById("portfolioname").value;
            document.getElementById("price").innerHTML = sharenumber + " shares of " + ticker + " at "+ price + " have been added to " +  portfolioname + " for a total of $" + (price * sharenumber).toFixed(2);
            let packet = {ticker, sharenumber, price, total: (sharenumber * price).toFixed(2), date: new Date()}
            let user = JSON.parse(sessionStorage.getItem("user"));
            (user.portfolios[portfolioname] == undefined) ? user.portfolios[portfolioname] = [packet] : user.portfolios[portfolioname].push(packet);
            sessionStorage.setItem("user", JSON.stringify(user));
            document.getElementById("ticker").value = "";
            document.getElementById("sharenumber").value = "";
            document.getElementById("portfolioname").value = "";
        });
}

const update = document.getElementById("update");
update.addEventListener("submit", updatePortfolio);

async function updatePortfolio(event) {
    event.preventDefault();
    let user = JSON.parse(sessionStorage.getItem("user"));
    const update = await fetch('/update', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user: user,
        }),
    }).then((response) => response.json()).then((data) => {
        console.log(data.message);
    });
}
