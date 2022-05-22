//registration
const reg = document.getElementById("reg-form");
reg.addEventListener("submit", registerUser);

async function registerUser(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    document.getElementById("username").value = "";
    document.getElementById("password").value = "";

    const result = await fetch("/register", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        username: username,
        password: password,
        }),
    }).then((response) => response.json()).then((data) => { 
        alert(data.message);    
    });
}

//authentication
const login = document.getElementById("login-form");
login.addEventListener("submit", authenticate);

async function authenticate(event) {
    console.log("authenticating");
    event.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    const result = await fetch("/auth", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        username: username,
        password: password,
        }),
    }).then((response) => console.log(response.json()));
}