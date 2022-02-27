let display = document.getElementById("display");

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
                console.log(message);
                display.innerText = message;
              }
            });
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
