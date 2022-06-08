if (sessionStorage.getItem("username") == null) {
    window.location.href = "/index.html";
}

document.getElementById("header").innerHTML += " " + sessionStorage.getItem("viewingPortfolio");
let portfolio = JSON.parse(sessionStorage.getItem("user")).portfolios[sessionStorage.getItem("viewingPortfolio")];
async function load() {
    for (let key in portfolio) {
        let packet = portfolio[key];
        const result = await fetch('/search', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ticker: packet.ticker,
            }),
        }).then((response) => response.json()).then((price) => {
                currentprice = Number(price).toFixed(2);
                currenttotal = (currentprice * packet.sharenumber).toFixed(2)
                let date = new Date(packet.date);
                let dateString = (date.getMonth() + 1) + "/" +  date.getDate() + "/" + date.getFullYear();
                document.getElementById("table").innerHTML += "<tr><td>" + packet.ticker + "</td><td>" + packet.sharenumber + "</td><td>" + "$"+packet.price + "</td><td>" + "$"+packet.total + "</td><td>" + dateString + "</td><td>" + "$"+currentprice + "</td><td>" + "$"+currenttotal + "</td><td>" + calcPc(packet.total, currenttotal) + "</td><td>" + "$"+(currenttotal - packet.total).toFixed(2);
                (sessionStorage.getItem("total") == undefined) ? sessionStorage.setItem("total", packet.total) : sessionStorage.setItem("total", Number(sessionStorage.getItem("total")) + Number(packet.total));
                (sessionStorage.getItem("currenttotal") == undefined) ? sessionStorage.setItem("currenttotal", currenttotal) : sessionStorage.setItem("currenttotal", Number(sessionStorage.getItem("currenttotal")) + Number(currenttotal));
                (sessionStorage.getItem("profit") == undefined) ? sessionStorage.setItem("profit", (currenttotal - packet.total).toFixed(2)) : sessionStorage.setItem("profit", Number(sessionStorage.getItem("profit")) + Number(currenttotal - packet.total));
        });
    }
    document.getElementById("table").innerHTML += "<tr><td>" + "Total" + "</td><td>" + "</td><td>" + "</td><td>" + "$" + sessionStorage.getItem("total") + "</td><td>" + "</td><td>" + "</td><td>" + "$" + (Number(sessionStorage.getItem("currenttotal"))).toFixed(2) + "</td><td>" + calcPc(Number(sessionStorage.getItem("total")), Number(sessionStorage.getItem("currenttotal"))) + "</td><td>" + "$" + (Number(sessionStorage.getItem("profit"))).toFixed(2);  
    sessionStorage.removeItem("total");
    sessionStorage.removeItem("currenttotal");
    sessionStorage.removeItem("profit");
}

function calcPc(n1,n2){
    return (((n2 - n1) / n1 * 100).toLocaleString('fullwide', {maximumFractionDigits:3}) + "%");
}

load();
