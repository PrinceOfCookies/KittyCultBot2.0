const chalk = require("chalk");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const { commands } = client;
      const { commandName, user } = interaction;
      const command = commands.get(commandName);
      const cooldownKey = `${user.id}-${command?.data?.name ?? command?.name ?? commandName}`;

      if (!command) return;

      try {
        // Check if the command is on cooldown for that guild
        if (command.cooldown) {
          if (client.cooldowns.has(cooldownKey)) {
            const timeLeft = client.cooldowns.get(cooldownKey);
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
          client.cooldowns.set(cooldownKey, Date.now() + cd);
          setTimeout(() => {
            client.cooldowns.delete(cooldownKey);
          }, cd);
        }
      } catch (err) {
        console.log(err);
        const payload = {
          content: `Something went wrong while executing this command!`,
          ephemeral: true,
        };

        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(payload);
          return;
        }

        await interaction.reply(payload);
      }
    } else if (interaction.isButton()) {
      return;
    }
  },
};
