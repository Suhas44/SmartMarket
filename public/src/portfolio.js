if (sessionStorage.getItem("viewingPortfolio") == null) {
    window.location.href = "/user.html";
}

document.getElementById("header").innerHTML += " " + "<b>" + sessionStorage.getItem("viewingPortfolio");
let portfolio = JSON.parse(sessionStorage.getItem("user")).portfolios[sessionStorage.getItem("viewingPortfolio")];
let active = portfolio.active;
let sold = portfolio.sold;
async function load() {
    let isActive = (active.length !== 0);
    let isSold = (sold.length !== 0);
    if (!isActive && !isSold) {
        document.getElementById("profitheader").innerHTML = "You currently have no investments";   
    }

    if (isActive) {
        var index = 0;
        for (let key in active) {
            let packet = active[key];
            const result = await fetch('/search', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ticker: packet.ticker,
                }),
            }).then((response) => response.json()).then((price) => {
                    let currentprice = Number(price).toFixed(2);
                    let currenttotal = (currentprice * packet.sharenumber).toFixed(2)
                    let date = new Date(packet.date);
                    let dateString = (date.getMonth() + 1) + "/" +  date.getDate() + "/" + date.getFullYear();
                    let percentgain = calcPc(packet.total, currenttotal);
                    let profit = (currenttotal - packet.total).toFixed(2);
                    document.getElementById("table").innerHTML += "<tr><td>" + packet.ticker + "</td><td>" + packet.sharenumber + "</td><td>" + "$"+packet.price + "</td><td>" + "$"+packet.total + "</td><td>" + dateString + `</td><td id="current${index}">` + "$"+currentprice + `</td><td id="total${index}">` + "$"+currenttotal + `</td><td id="gain${index}">` + percentgain + `</td><td id="profit${index}">` + "$" + profit + `</td><td> <button onclick="sell(${index})"> <a>Sell</a></button>` + `</td><td> <button onclick="remove(${index})"> <a>Remove</a></button>`;
                    (sessionStorage.getItem("total") == undefined) ? sessionStorage.setItem("total", packet.total) : sessionStorage.setItem("total", Number(sessionStorage.getItem("total")) + Number(packet.total));
                    (sessionStorage.getItem("currenttotal") == undefined) ? sessionStorage.setItem("currenttotal", currenttotal) : sessionStorage.setItem("currenttotal", Number(sessionStorage.getItem("currenttotal")) + Number(currenttotal));
                    (sessionStorage.getItem("profit") == undefined) ? sessionStorage.setItem("profit", (currenttotal - packet.total).toFixed(2)) : sessionStorage.setItem("profit", Number(sessionStorage.getItem("profit")) + Number(currenttotal - packet.total));
            });
            index += 1;
        }
        document.getElementById("table").innerHTML += "<tr><td>" + "Total" + "</td><td>" + "</td><td>" + "</td><td>" + "$" + (Number(sessionStorage.getItem("total"))).toFixed(2) + "</td><td>" + "</td><td>" + "</td><td>" + "$" + (Number(sessionStorage.getItem("currenttotal"))).toFixed(2) + "</td><td>" + calcPc(Number(sessionStorage.getItem("total")), Number(sessionStorage.getItem("currenttotal"))) + "</td><td>" + "$" + (Number(sessionStorage.getItem("profit"))).toFixed(2)+ "</td><td>";  
        sessionStorage.setItem("allProfit", (Number(sessionStorage.getItem("profit"))).toFixed(2));
        sessionStorage.removeItem("total");
        sessionStorage.removeItem("currenttotal");
        sessionStorage.removeItem("profit");
    } else {
        document.getElementById("table").innerHTML += "<tr><td>No active shares</td>";
    }

    if (isSold) {
        for (let key in sold) {
            let packet = sold[key];
            let date = new Date(packet.date);
            let dateString = (date.getMonth() + 1) + "/" +  date.getDate() + "/" + date.getFullYear(); 
            document.getElementById("sold").innerHTML += "<tr><td>" + packet.ticker + "</td><td>" + packet.sharenumber + "</td><td>" + "$"+packet.price + "</td><td>" + "$"+packet.total + "</td><td>" + dateString + "</td><td>" + "$"+packet.soldprice + "</td><td>" + "$"+packet.soldtotal + "</td><td>" + packet.gain + "%" +"</td><td>" + "$" + packet.profit;
            (sessionStorage.getItem("total") == undefined) ? sessionStorage.setItem("total", packet.total) : sessionStorage.setItem("total", Number(sessionStorage.getItem("total")) + Number(packet.total));
            (sessionStorage.getItem("currenttotal") == undefined) ? sessionStorage.setItem("currenttotal", packet.soldtotal) : sessionStorage.setItem("currenttotal", Number(sessionStorage.getItem("currenttotal")) + Number(packet.soldtotal));
            (sessionStorage.getItem("profit") == undefined) ? sessionStorage.setItem("profit", packet.profit) : sessionStorage.setItem("profit", Number(sessionStorage.getItem("profit")) + Number(packet.profit));
        }
        document.getElementById("sold").innerHTML += "<tr><td>" + "Total" + "</td><td>" + "</td><td>" + "</td><td>" + "$" + (Number(sessionStorage.getItem("total"))).toFixed(2) + "</td><td>" + "</td><td>" + "</td><td>" + "$" + (Number(sessionStorage.getItem("currenttotal"))).toFixed(2) + "</td><td>" + calcPc(Number(sessionStorage.getItem("total")), Number(sessionStorage.getItem("currenttotal"))) + "</td><td>" + "$" + (Number(sessionStorage.getItem("profit"))).toFixed(2);
        document.getElementById("profitheader").innerHTML += (Number(sessionStorage.getItem("allProfit")) + Number(sessionStorage.getItem("profit"))).toFixed(2);
        sessionStorage.removeItem("allProfit");
        sessionStorage.removeItem("total");
        sessionStorage.removeItem("currenttotal");
        sessionStorage.removeItem("profit");
    } else {
        document.getElementById("sold").style.visibility = "hidden";
        document.getElementById("soldheader").style.visibility = "hidden";
    }
}

function calcPc(n1,n2){
    return (((n2 - n1) / n1 * 100).toLocaleString('fullwide', {maximumFractionDigits:3}) + "%");
}

load();

sessionStorage.setItem("viewingTicker", JSON.stringify([null]));

const tickerform = document.getElementById("ticker-form");
tickerform.addEventListener("submit", preview);

async function preview(event) {
    event.preventDefault();
    let ticker = document.getElementById("ticker").value.toUpperCase();
    let sharenumber = document.getElementById("sharenumber").value;
    if (ticker == "") {
        alert("Please enter a ticker");
        return false;
    }
    if (sharenumber == "") {
        alert("Please enter a quantity");
        return false;
    }
    await searchTicker().then((data) => {
        price = Number(data).toFixed(2)
        document.getElementById("price").innerHTML += ticker + " is priced at $" + price + " per share. <br>" + "Do you want to add " + sharenumber + " shares of SWN for a total of $" + (Number(sharenumber) * Number(price)).toFixed(2) + "?";    
        sessionStorage.setItem("viewingTicker", JSON.stringify([ticker, data]));
    });
}

const addform = document.getElementById("add");
addform.addEventListener("submit", add);

async function add(event) {
    let ticker = document.getElementById("ticker").value.toUpperCase();
    let sharenumber = document.getElementById("sharenumber").value;
    event.preventDefault();
    if (ticker == "") {
        alert("Please enter a ticker");
        return;
    }

    if (sharenumber == "") {
        alert("Please enter a quantity");
        return;
    }
        
    (JSON.parse(sessionStorage.getItem("viewingTicker"))[0] !== ticker) ? (ticker = ticker.toUpperCase(), price = await searchTicker(ticker).then((data) => {return data})) : (ticker = JSON.parse(sessionStorage.getItem("viewingTicker"))[0], price = Number(JSON.parse(sessionStorage.getItem("viewingTicker"))[1]).toFixed(2));
    price = Number(price).toFixed(2);
    let portfolioname = sessionStorage.getItem("viewingPortfolio");
    document.getElementById("price").innerHTML = sharenumber + " shares of " + ticker + " at " + "$" + price + " have been added to " +  portfolioname + " for a total of $" + (price * sharenumber).toFixed(2);
    let packet = {ticker, sharenumber, price, total: (sharenumber * price).toFixed(2), date: new Date()}
    let user = JSON.parse(sessionStorage.getItem("user"));
    user.portfolios[portfolioname].active.push(packet); 
    sessionStorage.setItem("user", JSON.stringify(user));
    document.getElementById("ticker").value = "";
    document.getElementById("sharenumber").value = "";
    updatePortfolio().then(() => {
        location.reload();
    });
} 

async function searchTicker() {
    let ticker = document.getElementById("ticker").value.toUpperCase();
    const result = await fetch('/search', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ticker: ticker,
        }),
    }).then((response) => response.json()).then((price) => {
        return price;
    }
    );
    return result;
}

async function sell(index) {
    let user = JSON.parse(sessionStorage.getItem("user"));
    let portfolioname = sessionStorage.getItem("viewingPortfolio");
    let packet = user.portfolios[portfolioname].active[index];
    let ticker = packet.ticker;
    if (confirm("Are you sure you want to sell " + ticker + "?")) {
        packet.soldprice = Number(document.getElementById("current" + index).innerHTML.slice(1));
        packet.soldtotal = Number(document.getElementById("total" + index).innerHTML.slice(1));
        packet.gain = Number(document.getElementById("gain" + index).innerHTML.substring(0, document.getElementById("gain" + index).innerHTML.length - 1));
        packet.profit = Number(document.getElementById("profit" + index).innerHTML.slice(1));
        user.portfolios[portfolioname].sold.push(packet);
        user.portfolios[portfolioname].active.splice(index, 1);
        sessionStorage.setItem("user", JSON.stringify(user));
        updatePortfolio().then(() => {
            location.reload();
        });
    }
}

async function remove(index) {
    let user = JSON.parse(sessionStorage.getItem("user"));
    let portfolioname = sessionStorage.getItem("viewingPortfolio");
    let ticker = user.portfolios[portfolioname].active[index].ticker;
    if (confirm("Are you sure you want to remove " + ticker + "?")) {
        user.portfolios[portfolioname].active.splice(index, 1);
        sessionStorage.setItem("user", JSON.stringify(user));
        updatePortfolio().then(() => {
            location.reload();
        });
    }
}

async function updatePortfolio() {
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