const { SlashCommandBuilder,PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Sets timeout")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((option) =>
      option
        .setName("time")
        .setDescription("amount of time (in seconds) to set timeout to")
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(21600)
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("user to set timeout for")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("reason for timeout")
        .setRequired(false)
    ),
  async execute(interaction) {
    const { channel, options } = interaction;
    let time = options.getInteger("time");
    let user = options.getUser("user");
    let reason = options.getString("reason") ? options.getString("reason") : "No reason provided";

    // Timeout the user
    // Get the member
    const member = await interaction.guild.members.fetch(user.id);
    // Timeout the member
    member.timeout(time * 1000 );

    return await interaction.reply({
      content: `User ${user.username} has been timed out for ${time} second(s) by ${interaction.user.username} for reason ${reason}`,
    });
  },
};
