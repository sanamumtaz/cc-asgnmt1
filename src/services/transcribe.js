const fs = require("fs");

const methods = () => ({
  createfileIfNotExists: (file) => {
    return new Promise((resolve) => {
      fs.access(file, fs.constants.F_OK, (err) => {
        err ? resolve(false) : resolve(true);
      });
    });
  },
});
module.exports = methods;
