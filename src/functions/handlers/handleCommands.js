const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { readdirSync } = require("fs");
const { TOKEN } = process.env;
const chalk = require("chalk");

module.exports = async (client) => {
  client.handleCommands = async () => {
    const { commands, commandArray, cooldowns } = client;
    const commandFolders = readdirSync("./src/commands");

    for (const folder of commandFolders) {
      const commandForStart = Math.floor(Date.now());

      const commandFiles = readdirSync(`./src/commands/${folder}`).filter(
        (file) => file.endsWith(".js")
      );

      for (const file of commandFiles) {
        const command = require(`../../commands/${folder}/${file}`);
        const properties = { folder, ...command };

        let name = command.data.name;
        let color = command.color ? command.color : chalk.white;

        commands.set(name, properties);
        cooldowns.set(command.data.name, new Map());
        commandArray.push(command.data.toJSON());

        console.log(
          `${await client.color("#b3b3b3", "[")}${chalk.green(
            `${folder} Command`
          )}${await client.color("#b3b3b3", "]")} ${color(
            name
          )} ${await client.color("#b3b3b3", "loaded in")} ${chalk.yellow(
            Math.floor(Math.floor(Date.now()) - commandForStart) + "ms")}`
        );
      }
    }

    const clientID = "1198849966643347456";


    const rest = new REST({ version: "10" }).setToken(TOKEN);

    try {
      console.log(chalk.blue("Started refreshing application (/) commands."));
      const refreshStart = Math.floor(Date.now());
      await rest.put(
        Routes.applicationCommands(clientID),
        { body: commandArray },
      );

      console.log(
        chalk.blue("Successfully reloaded application (/) commands in ") +
          chalk.yellow(Math.floor(Math.floor(Date.now()) - refreshStart) + "ms")
      );
    } catch (error) {
      console.error(error);
    }
  };
};
