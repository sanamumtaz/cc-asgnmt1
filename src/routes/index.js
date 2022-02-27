const testimonialController = require("../controllers/transcribe");

module.exports = function (app) {
  app.post("/api/submit", testimonialController.submitFile);
  app.post("/api/transcription", testimonialController.getTranscription);
  app.post("/api/deleteJob", testimonialController.deleteJob);
};
