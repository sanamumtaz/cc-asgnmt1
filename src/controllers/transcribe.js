const controller = {
  submitFile: async function (req, response) {
    const { url } = req.body;

    if (url) {
      response.send("File upload initiated.");
    } else {
      response.status(400).send({ error: "Bad Data" });
    }
  },
  getTranscription: async function (req, response) {
    response.send("Called after progress complete");
  },
  deleteJob: async function (req, response) {
    response.send("Deleted successfully");
  },
};
module.exports = controller;
