const { ChannelType } = require("discord.js");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

let cooldowns = {}; // Store cooldowns per command per user

module.exports = {
	name: "messageCreate",
	async execute(message, client) {
		const botClient = client ?? message.client;
		const resolveBotPath = botClient?.resolveBotPath
			? botClient.resolveBotPath.bind(botClient)
			: (...parts) => path.join(__dirname, "../../../", ...parts);

		if (message.author.bot || message.channel.type === ChannelType.DM) return;
		if (["1204930736323567707", "1202615121961295912"].includes(message.channel.id)) return;

		if (!message.content || typeof message.content !== "string") return;

		const commands = {
			joinvc: ["joinoryoureabitch", "justjoinbruh"],
			leavevc: ["leavevc", "gtfo", "disconnect"],
			cat: [
				"cat",
				"kitty",
				":3",
				"meow",
				"car",
				"leighcan...",
				"nya",
				"leighcanfuckoffcuzshebeinalittlebitchcuzshekeepstellingmetoaddshitlikecarmeow:3andkittyjkyourenotabitchbutyouarealittleweirdandalsosupergaybutthatsnotthereasonthatyouarealittleweirdyouareabitchthoughmyfriendnicknameforyouprovesit"
			],
			someone: "@someone"
		};

		const messageContentLower = message.content.toLowerCase();
		const voiceApi = loadVoiceApi();

		if (commands.joinvc.some((cmd) => messageContentLower.includes(cmd))) {
			console.log("Join VC command detected");

			if (!voiceApi) {
				return message.channel.send("Voice support is not available on this host.");
			}

			if (voiceApi.getVoiceConnection(message.guild.id)) {
				return message.channel.send("I'm already in a voice channel!");
			}

			try {
				const catAudioPaths = [
					resolveBotPath("cat-meow-14536.mp3"),
					resolveBotPath("cat-meow-297927.mp3")
				];
				const randomCatSound = catAudioPaths[Math.floor(Math.random() * catAudioPaths.length)];

				if (!fs.existsSync(randomCatSound)) {
					console.error("Audio file not found:", randomCatSound);
					return message.channel.send("Error: Cat sound file not found.");
				}

				const connection = voiceApi.joinVoiceChannel({
					channelId: "1211789111942185020",
					guildId: message.guild.id,
					adapterCreator: message.guild.voiceAdapterCreator
				});
				const player = voiceApi.createAudioPlayer();
				const resource = voiceApi.createAudioResource(randomCatSound);

				connection.subscribe(player);
				player.play(resource);

				return message.channel.send("Joined VC and playing cat audio!");
			} catch (error) {
				console.error("Failed to join VC:", error);
				return message.channel.send("Error: Unable to join VC.");
			}
		}

		if (commands.leavevc.some((cmd) => messageContentLower.includes(cmd))) {
			console.log("Leave VC command detected");

			if (!voiceApi) {
				return message.channel.send("Voice support is not available on this host.");
			}

			const connection = voiceApi.getVoiceConnection("1142929470534197278");
			if (connection) {
				connection.destroy();
				return message.channel.send("Disconnected from voice channel.");
			}

			return message.channel.send("I'm not in a voice channel.");
		}

		if (commands.cat.some((cmd) => messageContentLower.includes(cmd))) {
			console.log("Cat command detected");

			if (cooldowns.cat && cooldowns.cat > Math.floor(Date.now() / 1000)) return;
			cooldowns.cat = Math.floor(Date.now() / 1000) + 3;

			try {
				const response = await fetch("https://api.thecatapi.com/v1/images/search?limit=1");

				if (!response.ok) {
					throw new Error(`HTTP ${response.status} ${response.statusText}`);
				}

				const data = await response.json();

				if (Array.isArray(data) && data.length > 0 && data[0]?.url) {
					return message.channel.send(data[0].url);
				}

				return message.channel.send("Couldn't find a cat image.");
			} catch (error) {
				console.error("Error fetching cat image:", error);
				return message.channel.send("Sorry, I couldn't fetch a cat image right now.");
			}
		}

		if (messageContentLower.includes("@someone")) {
			console.log("@someone command detected");

			if (cooldowns.someone && cooldowns.someone > Math.floor(Date.now() / 1000)) return;
			cooldowns.someone = Math.floor(Date.now() / 1000) + 3;

			const members = message.guild.members.cache
				.filter((member) => !member.user.bot)
				.map((member) => member.id);

			if (members.length === 0) return message.channel.send("No available members to mention.");

			const random = members[Math.floor(Math.random() * members.length)];
			return message.channel.send(`<@${random}>`);
		}
	},
	color: chalk.blue
};

function loadVoiceApi() {
	try {
		return require("@discordjs/voice");
	} catch (error) {
		if (error.code !== "MODULE_NOT_FOUND") throw error;
		return null;
	}
}
