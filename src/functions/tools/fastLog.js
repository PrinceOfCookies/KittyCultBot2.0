const { green, yellow } = require("chalk");

module.exports = (client) => {
  client.fastLog = async (messageText, color, name, start) => {
    const time = Date.now() - start;
    const bColor = "#b3b3b3";
    
    const logMessage = (
      await client.color(bColor, "[") +
      green(messageText) +
      await client.color(bColor, "] ") +
      await client.color(color, name) +
      await client.color(bColor, " loaded in ") +
      yellow(`${time}ms`)
    )

    return console.log(logMessage);
  };
};
