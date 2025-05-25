const { ChannelType } = require("discord.js");
const axios = require("axios");
const { joinVoiceChannel } = require("@discordjs/voice");
let cd = 1;
let chalk = require("chalk");

async function fetchCatImage() {
    try {
        const response = await axios.get('https://api.thecatapi.com/v1/images/search?limit=1');
        return response.data;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    name: "messageCreate",
    async execute(message) {
        if (message.author.bot || message.channel.type === ChannelType.DM) return;
        if (message.channel.id == "1204930736323567707" || message.channel.id == "1202615121961295912") return;

        // Ensure message.content exists and is a string
        if (!message.content || typeof message.content !== "string") return;

        let commands = {
            joinvc: [
                "joinoryoureabitch",
                "justjoinbruh"
            ],
            cat: [
                "cat",
                "kitty",
                ":3",
                "meow",
                "car",
                "leighcan..."
            ],
            someone: "@someone"
        };

        // Avoid direct reference to includes to prevent errors if message.content is null
        const messageContentLower = message.content.toLowerCase();

        // Check if it's any of the joinvc commands
        if (commands["joinvc"].some(cmd => messageContentLower.includes(cmd))) {
            console.log("Join VC command detected");

            const connection = joinVoiceChannel({
                channelId: "1211789111942185020",
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
            });
        }

        // Check if it's any of the cat commands
        if (commands["cat"].some(cmd => messageContentLower.includes(cmd))) {
            console.log("Cat command detected");
            if (cd > Date.now() / 1000) return;
            cd = Date.now() / 1000 + 3;

            try {
                const response = fetchCatImage();
                return message.channel.send(response.data[0].url);
            } catch (error) {
                console.error("Error fetching cat image:", error);
                message.channel.send("Sorry, I couldn't fetch a cat image right now.");
            }
        }

        // Check if it's the @someone command
        if (messageContentLower.includes("@someone")) {
            console.log("@someone command detected");
            if (cd > Date.now() / 1000) return;

            let members = message.guild.members.cache.filter(member => !member.user.bot).map(member => member.id);

            const random = members[Math.floor(Math.random() * members.length)];
            return message.channel.send(`<@${random}>`);
        }
    },
    color: chalk.blue,
};