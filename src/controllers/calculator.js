const calculatorUtils = require("../services/calculatorUtils");

const controller = {
  submitEquation: async function (req, response) {
    const { equation } = req.body;

    if (equation) {
      try {
        const evaluation = eval(equation);
        response.send({
          message: evaluation,
          ip: req.headers["x-forwarded-for"],
        });
      } catch {
        response.send({ message: "Error" });
      }
      const fileName = calculatorUtils().formatIP(
        req.headers["x-forwarded-for"]
      );
      calculatorUtils().logEntry(fileName, equation);
    } else {
      response.status(400).send({ error: "Bad Data" });
    }
  },
  getLog: async function (req, response) {
    const ip = req.headers["x-forwarded-for"];
    const fileName = calculatorUtils().formatIP(ip);
    const filePath = calculatorUtils().checkIfFileExists(fileName);
    if (filePath) {
      response.download(filePath);
    } else {
      response.status(400).send({ error: "No log exists" });
    }
  },
  deleteJob: async function (req, response) {
    response.send("Deleted successfully");
  },
};
module.exports = controller;
