const fs = require("fs");

const methods = () => ({
  createfileIfNotExists: (file) => {
    return new Promise((resolve) => {
      fs.access(file, fs.constants.F_OK, (err) => {
        err ? resolve(false) : resolve(true);
      });
    });
  },
  formatIP: (ip = "1") => {
    return ip.replace(/[.:]+/g, "");
  },
  checkIfFileExists: (fileName) => {
    const filePath = `${__dirname}/${fileName}.txt`;
    console.log(filePath);
    try {
      if (fs.existsSync(filePath)) {
        return filePath;
      }
    } catch (err) {
      return false;
    }
  },
  logEntry: (fileName, equation) => {
    const logger = fs.createWriteStream(`${__dirname}/${fileName}.txt`, {
      flags: "a",
    });

    logger.write(equation + "\n");
  },
});
module.exports = methods;
