const chalk = require("chalk");

module.exports = (client) => {
  client.color = async (hexC, text) => {
    let hexColor = chalk.hex(hexC);
    let colorText = hexColor(text);

    return colorText;
  };
};
