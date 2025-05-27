const { ChannelType } = require("discord.js");
const axios = require("axios");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, createAudioPlayerStatus, getVoiceConnection  } = require('@discordjs/voice');
const fs = require('fs');
const path = require('path');
const chalk = require("chalk");

const CAT_AUDIO_PATHS = [
    path.join(__dirname, '../../../cat-meow-14536.mp3'),
    path.join(__dirname, '../../../cat-meow-297927.mp3')
];

let cooldowns = {}; // Store cooldowns per command per user

module.exports = {
    name: "messageCreate",
    async execute(message) {
        if (message.author.bot || message.channel.type === ChannelType.DM) return;
        if (["1204930736323567707", "1202615121961295912"].includes(message.channel.id)) return;

        if (!message.content || typeof message.content !== "string") return;

		let commands = {
            joinvc: ["joinoryoureabitch", "justjoinbruh"],
            leavevc: ["leavevc", "gtfo", "disconnect"],
            cat: ["cat", "kitty", ":3", "meow", "car", "leighcan...", "nya", "leighcanfuckoffcuzshebeinalittlebitchcuzshekeepstellingmetoaddshitlikecarmeow:3andkittyjkyourenotabitchbutyouarealittleweirdandalsosupergaybutthatsnotthereasonthatyouarealittleweirdyouareabitchthoughmyfriendnicknameforyouprovesit"],
            someone: "@someone"
        };

        const messageContentLower = message.content.toLowerCase();

        // Handle Join VC command
if (commands["joinvc"].some(cmd => messageContentLower.includes(cmd))) {
    console.log("Join VC command detected");

    // Check if already in a voice channel
    if (getVoiceConnection(message.guild.id)) {
        return message.channel.send("I'm already in a voice channel!");
    }

    try {
        const connection = joinVoiceChannel({
            channelId: "1211789111942185020",
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
        });

        const player = createAudioPlayer();
        const randomCatSound = CAT_AUDIO_PATHS[Math.floor(Math.random() * CAT_AUDIO_PATHS.length)];

        // Check if file exists before trying to play it
        if (!fs.existsSync(randomCatSound)) {
            console.error("Audio file not found:", randomCatSound);
            return message.channel.send("Error: Cat sound file not found.");
        }

        const resource = createAudioResource(randomCatSound);
		connection.subscribe(player);
        player.play(resource);

        return message.channel.send("Joined VC and playing cat audio!");
    } catch (error) {
        console.error("Failed to join VC:", error);
        return message.channel.send("Error: Unable to join VC.");
    }
}

        if (commands["leavevc"].some(cmd => messageContentLower.includes(cmd))) {
            console.log("Leave VC command detected");

            const connection = getVoiceConnection("1142929470534197278");
            if (connection) {
                connection.destroy();
                return message.channel.send("Disconnected from voice channel.");
            } else {
                return message.channel.send("I'm not in a voice channel.");
            }
        }

        // Handle Cat command
        if (commands["cat"].some(cmd => messageContentLower.includes(cmd))) {
            console.log("Cat command detected");

            if (cooldowns["cat"] && cooldowns["cat"] > Math.floor(Date.now() / 1000)) return;
            cooldowns["cat"] = Math.floor(Date.now() / 1000) + 3;

            try {
                const response = await axios.get("https://api.thecatapi.com/v1/images/search?limit=1");
                if (response.data && response.data.length > 0) {
                    return message.channel.send(response.data[0].url);
                } else {
                    return message.channel.send("Couldn't find a cat image.");
                }
            } catch (error) {
                console.error("Error fetching cat image:", error);
                return message.channel.send("Sorry, I couldn't fetch a cat image right now.");
            }
        }

        // Handle @someone command
        if (messageContentLower.includes("@someone")) {
            console.log("@someone command detected");

            if (cooldowns["someone"] && cooldowns["someone"] > Math.floor(Date.now() / 1000)) return;
            cooldowns["someone"] = Math.floor(Date.now() / 1000) + 3;

            let members = message.guild.members.cache.filter(member => !member.user.bot).map(member => member.id);
            if (members.length === 0) return message.channel.send("No available members to mention.");

            const random = members[Math.floor(Math.random() * members.length)];
            return message.channel.send(`<@${random}>`);
        }
    },
    color: chalk.blue
};
