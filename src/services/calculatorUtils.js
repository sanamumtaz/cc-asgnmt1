const fs = require("fs");
const readLastLines = require("read-last-lines");

const methods = () => ({
  formatIP: (ip = "1") => {
    return ip.split(":")[0].replace(/[.:]+/g, "");
  },
  checkIfFileExists: (fileName) => {
    const filePath = `${__dirname}/${fileName}.txt`;

    try {
      if (fs.existsSync(filePath)) {
        return filePath;
      }
    } catch (err) {
      return false;
    }
  },
  logEntry: (fileName, equation, index) => {
    const logger = fs.createWriteStream(`${__dirname}/${fileName}.txt`, {
      flags: "a",
    });
    const currentDate = new Date();
    logger.write(`${index} ` + equation + " " + currentDate.getTime() + "\n");
    if (index % 12 === 0) {
      logger.write("Blocked" + "\n");
    }
  },
  returnLastXLine: async (filePath, count, reverse = false) => {
    let lastLines = [];
    const lines = await readLastLines.read(filePath, count);
    lastLines = lines.replace(/\r\n/g, "\n").split("\n");
    if(reverse) return lastLines.reverse();
    return lastLines;
  },
});
module.exports = methods;
