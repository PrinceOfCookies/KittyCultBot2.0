const { ActivityType, GatewayIntentBits } = require("discord.js");

module.exports = {
	enabled: true,
	envFile: ".env",
	tokenEnv: "TOKEN",

	paths: {
		functions: "src/functions",
		commands: "src/commands",
		events: "src/events"
	},

	clientOptions: {
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.GuildVoiceStates,
			GatewayIntentBits.MessageContent
		],

		presence: {
			activities: [
				{
					name: "Cat videos",
					type: ActivityType.Watching
				}
			],
			status: "online"
		},

		allowedMentions: {
			parse: ["users", "roles"],
			repliedUser: true
		}
	},

	tools: {
		mode: "extend"
	},

	functions: {
		mode: "extend",
		exclude: ["handleCommands.js", "handleEvents.js", "initSchema.js"]
	},

	events: {
		mode: "replace"
	},

	autoHandleCommands: true,
	autoHandleEvents: false,

	async setup(client) {
		const initPath = client.resolveBotPath("src/functions/database/initSchema.js");

		try {
			await require(initPath)(client);
		} catch (err) {
			if (err.code !== "MODULE_NOT_FOUND") throw err;
		}
	}
};
