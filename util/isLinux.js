let os = require("os");

/**
 * Checks if the host is running on the Linux Kernel
 * @returns {boolean}
 */
module.exports = function () {
  let osPlat = os.platform();
  if (osPlat == "linux") return true;
  else return false;
};
