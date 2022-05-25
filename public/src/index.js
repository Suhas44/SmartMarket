//registration
const reg = document.getElementById("reg-form");
reg.addEventListener("submit", registerUser);

async function registerUser(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (credentialRestrictions(username, password)) {
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
            if (data.status == true) {
                document.getElementById("username").value = "";
                document.getElementById("password").value = "";
            }
            alert(data.status) 
        });
    } else {
        alert("Username and password must be at least 4 characters long and contain only letters and numbers");
    }
}

//authentication
const login = document.getElementById("login-form");
login.addEventListener("submit", authenticate);

async function authenticate(event) {
    event.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    
    if (credentialRestrictions(username, password)) {
        const result = await fetch("/auth", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            username: username,
            password: password,
            }),
        }).then((response) => response.json()).then((data) => { 
            if (data.status) {
                document.getElementById("login-username").value = "";
                document.getElementById("login-password").value = "";
                localStorage.setItem("username", username);
                window.location.href = "/user.html";
            } else {
                alert("Username or password is incorrect");
            }
        });} else {
            alert("Username and password must be at least 4 characters long and contain only letters and numbers");
        }
}

function credentialRestrictions(username, password) {
    return ((username.match("^[A-Za-z0-9]+$")) && (password.match("^[A-Za-z0-9]+$") && (username.length >= 4) && (password.length >= 4)));
}