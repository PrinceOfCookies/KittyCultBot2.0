const { SlashCommandBuilder } = require("discord.js");
const chalk = require("chalk");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Ask 8ball a question")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("Question you wanna ask")
        .setRequired(true)
    ),

  async execute(interaction) {
    const { options } = interaction;
    let q = await options.getString("question");
    q = q.toLowerCase();
    let possibleResponses = [
      "Ask again later",
      "Don't count on it",
      "Yes definitely",
      "You may rely on it",
      "Concentrate and ask again",
      "Yes",
      "It is decidedly so",
      "Outlook not so good",
      "Most likely",
      "Better not tell you now",
      "Yes",
      "Outlook good",
      "Cannot predict now",
      "My reply is no",
      "shut up",
      "no <3",
      "It is certain",
      "Definitely not",
      "Signs point to yes",
      "Without a doubt",
      "Reply hazy, try again",
      "My sources say no",
      "Nope!",
      "Very doubtful",
      "fuck off",
      "As I see it, yes",
    ];

    let noResponses = [
      "Reply hazy, try again",
      "Ask again later",
      "Better not tell you now",
      "Cannot predict now",
      "Concentrate and ask again",
      "Don't count on it",
      "My reply is no",
      "My sources say no",
      "Outlook not so good",
      "Very doubtful",
      "no <3",
      "shut up",
      "definitely not",
      "nope!",
      "fuck off",
    ];

    let response =
      possibleResponses[Math.floor(Math.random() * possibleResponses.length)];

    // Check if the question includes "prince" and "femboy"
    if (q.includes("prince") && q.includes("femboy")) {
      response = `${
        noResponses[Math.floor(Math.random() * noResponses.length)]
      } (Hes not a femboy)`;
    }

    if (q.includes("admin") || q.includes("admon")) {
      response = `${
        noResponses[Math.floor(Math.random() * noResponses.length)]
      }`;
    }

    if (interaction) {
      return await interaction.reply({
        content: `Question: ${q}\nAnwser: ${response}`,
      });
    } else {
      console.log("[I")

      console.log(
        await client.color(
          "#2afeb7",
          `[Command Issue]: Interaction not valid for command "8ball"`
        )
      );
    }
  },
  color: chalk.hex("#DEADED"),
};
