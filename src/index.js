var express = require("express");
const dotenv = require("dotenv");

dotenv.config();

var cors = require("cors");

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/api/ping", (req, res) => {
  res.send("pong");
});

require("./routes/index")(app);

const DIST_DIR = path.join(__dirname, "static");
const HTML_FILE = path.join(DIST_DIR, "index.html");
app.use(express.static(path.join(__dirname)));
app.use(express.static(DIST_DIR));
app.get("/", (req, res) => {
  res.sendFile(HTML_FILE);
});
app.use("/rewardpicker", express.static(path.join(__dirname, "static")));

app.listen(process.env.PORT || 8083);
