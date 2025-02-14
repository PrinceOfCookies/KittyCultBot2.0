const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Sets slowmode")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((option) =>
      option
        .setName("time")
        .setDescription("amount of time (in seconds) to set slowmode to")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const { channel, options } = interaction;
    let time = options.getInteger("time");

    if (time < 0) time = 0;
    if (time > 21600) time = 21600;
    channel.setRateLimitPerUser(time);

    interaction.reply({
      content: `Channel slowmode has been set to ${time} second(s) by ${interaction.user.displayName}`,
    });
  },
};
