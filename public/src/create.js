const tickerform = document.getElementById("ticker-form");
tickerform.addEventListener("submit", searchTicker);

async function searchTicker(event) {
    event.preventDefault();
    const ticker = document.getElementById("ticker").value;
    const result = await fetch('/search', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ticker: ticker,
        }),
    }).then((response) => response.json()).then((data) => {
            document.getElementById("ticker").value = "";
            document.getElementById("price").innerHTML = data;
        });
}