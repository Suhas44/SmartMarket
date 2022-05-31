document.getElementById("submit").addEventListener("submit", searchTicker);

async function searchTicker(event) {
    console.log("searching create")
    event.preventDefault();
    const ticker = document.getElementById("ticker").value;
    const result = await fetch("/search", {
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
            console.log(data);
        });
}