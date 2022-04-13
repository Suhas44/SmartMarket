async function registerUser() {
  const username = "test";
  const password = "error";

  const result = await fetch("/theusers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  })
}

registerUser();
document.getElementById("table").innerHTML = "<h1>Hello</h1>"