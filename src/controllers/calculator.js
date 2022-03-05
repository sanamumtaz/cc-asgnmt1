const calculatorUtils = require("../services/calculatorUtils");

const getCurrentTimestamp = () => {
  const currentTime = new Date();
  return currentTime.getTime();
};

const sendStatusWithLog = async (status, filePath, response) => {
  const logs = await calculatorUtils().returnLastXLine(filePath, 5);
  response.send({
    status,
    logs,
  });
};

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
      const filePath = calculatorUtils().checkIfFileExists(fileName);
      if (filePath) {
        const lines = await calculatorUtils().returnLastXLine(filePath, 1);
        if (lines[0].split(" ")[0] !== "Blocked") {
          calculatorUtils().logEntry(
            fileName,
            equation,
            parseInt(lines[0].split(" ")[0]) + 1
          );
        } else {
          const getLastEntry = await calculatorUtils().returnLastXLine(
            filePath,
            2
          );
          calculatorUtils().logEntry(
            fileName,
            equation,
            parseInt(getLastEntry[0].split(" ")[0]) + 1
          );
        }
      } else {
        calculatorUtils().logEntry(fileName, equation, 1);
      }
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
  initialize: async function (req, response) {
    const ip = req.headers["x-forwarded-for"];
    const fileName = calculatorUtils().formatIP(ip);
    const filePath = calculatorUtils().checkIfFileExists(fileName);
    if (filePath) {
      const lines = await calculatorUtils().returnLastXLine(filePath, 1);
      if (lines[0] === "Blocked") {
        const getLastEntry = await calculatorUtils().returnLastXLine(
          filePath,
          2
        );
        const lastEntryTimestamp = getLastEntry[0].split(' ').reverse()[0];
        const currentTimestamp = getCurrentTimestamp();
        if (currentTimestamp - lastEntryTimestamp > 120000) {
          sendStatusWithLog('Allowed', filePath, response);
        } else {
          sendStatusWithLog('Blocked', filePath, response);
        }
      } else {
        sendStatusWithLog('Allowed', filePath, response);
      }
    } else {
      response.send({
        status: "Allowed",
      });
    }
  },
};
module.exports = controller;
