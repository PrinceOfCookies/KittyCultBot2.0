const chalk = require("chalk");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const { commands } = client;
      const { commandName, user } = interaction;
      const command = commands.get(commandName);

      if (!command) return;

      try {
        // Check if the command is on cooldown for that guild
        if (command.cooldown) {
          if (client.cooldowns.has(`${user.id}-${command.name}`)) {
            const timeLeft = client.cooldowns.get(`${user.id}-${command.name}`);
            let timeleft = timeLeft * 0.001 - Math.floor(Date.now() * 0.001);

            return await interaction.reply({
              content: `You are on cooldown for this command! Please wait ${Math.floor(
                timeleft
              )} more second(s) before using this command again!`,
              ephemeral: true,
            });
          }
        }

        await command.execute(interaction, client);

        if (command.cooldown) {
          const cd = command.cooldown * 1000;
          client.cooldowns.set(`${user.id}-${command.name}`, Date.now() + cd);
          setTimeout(() => {
            client.cooldowns.delete(`${user.id}-${command.name}`);
          }, cd);
        }
      } catch (err) {
        console.log(err);
        await interaction.reply({
          content: `Something went wrong while executing this command!`,
          ephemeral: true,
        });
      }
    } else if (interaction.isButton()) {
      return;
    }
  },
};
