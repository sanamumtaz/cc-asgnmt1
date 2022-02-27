const calculatorController = require("../controllers/calculator");

module.exports = function (app) {
  app.post("/api/submit", calculatorController.submitEquation);
  app.get("/api/logs", calculatorController.getLog);
  app.post("/api/deleteJob", calculatorController.deleteJob);
};
