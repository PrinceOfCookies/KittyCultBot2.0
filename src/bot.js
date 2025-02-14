require("dotenv").config();

const {
  GatewayIntentBits,
  Client,
  Collection,
  ActivityType,
} = require("discord.js");
const { connect, mongoose } = require("mongoose");
const { TOKEN, DBTOKEN } = process.env;
const { readdirSync } = require("fs");

mongoose.set("strictQuery", true);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
  presence: {
    activities: [
      { name: "Cat videos", type: ActivityType.Watching },
    ],
    status: "online",
  },
  allowedMentions: { parse: ["users", "roles"], repliedUser: true },
});

client.commands = new Collection();
client.cooldowns = new Collection();
client.commandArray = [];

const functionFiles = readdirSync("./src/functions");

for (const folder of functionFiles) {
  const functionFiles = readdirSync(`./src/functions/${folder}`).filter(
    (file) => file.endsWith(".js")
  );

  for (const file of functionFiles) {
    require(`./functions/${folder}/${file}`)(client);
  }
}

client.handleEvents().then(() => {
  client.handleCommands();
});

let s = Math.floor(Date.now());
client
  .login(TOKEN)
  .then(() => {
    console.log(`Took ${Math.floor(Date.now()) - s}ms to login`);
    s = Math.floor(Date.now());
    connect(DBTOKEN).catch((err) => console.log(err));
    console.log(`Took ${Math.floor(Date.now()) - s}ms to connect to database`);
  })
  .catch((err) => console.log(err));
