import TelegramBot from "node-telegram-bot-api";
import { commands } from "./bot/config/config.js";
import { handleUser, handleQuestion } from "./bot/handlers/others/index.js";
import { handleStart, handelMode, handelProfile } from "./bot/handlers/commands/index.js";
import { handleCallback } from "./bot/handlers/callbacks/handleCallback.js";
import "dotenv/config";

const bot = new TelegramBot(process.env.BOT_KEY!, {
  polling: true,
});

bot.setMyCommands(commands);

const commandsHandlers: { [key: string]: any } = {
  "/start": handleStart,
  "/profile": handelProfile,
  "/mode": handelMode,
};

const callbacksHandlers: { [key: string]: any } = {};
bot.on("text", async (message) => {
  const user = await handleUser(message);
  if (Object.keys(commandsHandlers).includes(message.text as string)) {
    const messageHandler = commandsHandlers[message.text as string];
    await messageHandler({ user, message, bot });
    return;
  }

  await handleQuestion({ user, message, bot });
});

bot.on("callback_query", async (ctx) => {
  const user = await handleUser(ctx.message!);
  await handleCallback({ ctx, bot, user });
});
