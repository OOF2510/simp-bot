let os = require('os')

module.exports = function () {
    let osPlat = os.platform();
    if (osPlat == "linux") return true;
    else return false;
}