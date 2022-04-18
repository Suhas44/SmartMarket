const result = fetch("/list")
        .then((response) => response.json())
        .then((data) => {
          var rawJSON = JSON.parse(data);
          var table = document.getElementById("table");
          for (var i = 0; i < rawJSON.length; i++) {
            var row = table.insertRow(i + 1);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            cell1.innerHTML = "&nbsp; &nbsp" + rawJSON[i].username;
            cell2.innerHTML = rawJSON[i].password;
          }
        });