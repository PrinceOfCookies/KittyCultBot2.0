const { SlashCommandBuilder } = require("discord.js");
const chalk = require("chalk")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kill")
    .setDescription("kill someone")
    .addUserOption((option) =>
      option.setName("user").setDescription("User kill")
    )
    .addStringOption((option) => 
      option
      .setName("reason")
      .setDescription("Your reason for killing someone")
    ),
  async execute(interaction) {
    let { options } = interaction
    let user = options.getUser("user") ? options.getUser("user") : interaction.user
    let reason = options.getString("reason") ? options.getString("reason") : "wait.. you have no reason!?!?"

    let name = interaction.user.globalName ? interaction.user.globalName : interaction.user.username
    let name1 = user.globalName ? user.globalName : user.username


    if (user == interaction.user) {
        await interaction.reply({
            content: `Damn.. you killed urself because ${reason}`
        })
    } else {
        await interaction.reply({
            content: `${name} just fuckin murdered ${name1}.. because ${reason}`
        })
    }
  },
  cooldown: 5,
  color:chalk.orange
};
