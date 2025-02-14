const { readdirSync } = require("fs");
const { white } = require("chalk");
const { connection } = require("mongoose");

module.exports = (client) => {
  client.handleEvents = async () => {
    const eventFolders = readdirSync("./src/events");

    for (const folder of eventFolders) {
      const eventFiles = readdirSync(`./src/events/${folder}`).filter((file) =>
        file.endsWith(".js")
      );

      switch (folder) {
        case "Client":
          for (const file of eventFiles) {
            const start = Math.floor(Date.now());
            const event = require(`../../events/${folder}/${file}`);
            let color = event.color;
            let name = event.name;

            if (color == undefined) {
              color = white;
              console.error("No color provided for event: " + name);
            }

            if (event.once) {
              client.once(name, (...args) => event.execute(...args, client));
              return await client.fastLog(`${folder} Event`, color, name, start);
            }

            client.on(name, (...args) => event.execute(...args, client));
            await client.fastLog(`${folder} Event`, color, name, start);
          }
          break;
        default:
          console.log(chalk.red(`Invalid event: ${folder}`));
          break;
      }
    }
  };
};
