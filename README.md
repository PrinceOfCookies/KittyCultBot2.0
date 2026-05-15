# KittyCultBot

KittyCultBot is the cat-focused Discord bot that runs under the MasterBot host.

## Runtime

- Bot config lives in `bots/kittycultbot/index.js`
- Bot env lives in `bots/kittycultbot/.env`
- Commands live in `bots/kittycultbot/src/commands`
- Bot events live in `bots/kittycultbot/src/events`
- Bot-specific tools live in `bots/kittycultbot/src/functions/tools`
- Bot database bootstrap lives in `bots/kittycultbot/src/functions/database/initSchema.js`

## Host behavior

- MasterBot loads this bot through `bots/kittycultbot/index.js`
- `client.handleCommands()` is host-owned and loads slash commands from the bot command root
- Shared tools and handlers still come from MasterBot unless KittyCultBot overrides them locally
- Unchanged slash commands skip REST refresh on startup because MasterBot hashes the loaded command definitions
- Startup logs include timing marks for the main boot phases when the worker finishes starting

## Bot config

- `enabled: true` keeps the bot eligible for startup
- `envFile: ".env"` tells MasterBot to load `bots/kittycultbot/.env`
- `tokenEnv: "TOKEN"` lets the bot token come from the bot env
- `functions.exclude` keeps the host command/event loaders from pulling in handler files that should stay internal

## Notes

- The current runtime is intentionally simple: bot-specific code stays in the bot folder, and shared bootstrapping stays in MasterBot.
- If KittyCultBot adds a `pm2` block in its config, MasterBot will include those per-bot PM2 settings when generating `ecosystem.config.js`.
