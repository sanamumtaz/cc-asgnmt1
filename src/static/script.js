const display = document.getElementById("display");
const contentSection = document.getElementsByTagName("section")[0];

const loading = document.getElementsByClassName("loading-container")[0];
const rightPanel = document.getElementsByClassName('logs-container')[0];
const blocked = document.getElementsByClassName("blocked-container")[0];
const logTable = document.getElementById("table");

function disableEqual() {
  const equalButton = document.getElementById("equal");
  equalButton.style.opacity = "0.4";
  equalButton.style.cursor = "not-allowed";
  equalButton.style.pointerEvents = "none";
  equalButton.addEventListener("click", (event) => {
    event.preventDefault();
  });
}

function initialize(afterSubmit = false) {
  fetch(`/api/initialize`, {
    method: "GET",
  })
    .then((response) => {
      response.json().then((jsonResponse) => {
        const { status, logs } = jsonResponse;
        if (status === "Allowed") {
          contentSection.classList.remove("displayNone");
          loading.classList.add("displayNone");
        } else {
          loading.classList.add("displayNone");
          blocked.classList.remove("displayNone");
          disableEqual();
        }
        if (logs) {
          rightPanel.classList.remove("displayNone");
          if (afterSubmit && logs[logs.length - 2] === "Blocked") {
            disableEqual();
            blocked.classList.remove("displayNone");
          }
          logTable.innerHTML = "";
          logs.forEach((log) => {
            if (log) {
              const row = document.createElement("tr");
              const entries = log.split(" ");
              entries.slice(0, 2).forEach((entry) => {
                const cell = document.createElement("td");
                cell.textContent = entry;
                row.appendChild(cell);
              });
              logTable.appendChild(row);
            }
          });
        }else{
          rightPanel.classList.add("displayNone");
        }
      });
    })
    .catch((err) => console.log(err));
}

let buttons = Array.from(document.getElementsByClassName("button"));

buttons.map((button) => {
  button.addEventListener("click", (e) => {
    switch (e.target.innerText) {
      case "C":
        display.innerText = "";
        break;
      case "=":
        fetch(`/api/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            equation: display.innerText,
          }),
        })
          .then((response) => {
            response.json().then((jsonResponse) => {
              const { message, err } = jsonResponse;
              if (!err) {
                display.innerText = message;
              }
            });
            initialize(true);
          })
          .catch((err) => console.log(err));
        break;
      case "←":
        if (display.innerText) {
          display.innerText = display.innerText.slice(0, -1);
        }
        break;
      case "Download Log":
        fetch(`/api/logs`, {
          method: "GET",
        })
          .then((response) => response.blob())
          .then((blob) => URL.createObjectURL(blob))
          .then((uril) => {
            var link = document.createElement("a");
            link.href = uril;
            link.download = "logs.txt";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          })
          .catch((err) => console.log(err));
        break;
      default:
        display.innerText += e.target.innerText;
    }
  });
});

initialize();
