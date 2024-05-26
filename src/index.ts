import TelegramBot from "node-telegram-bot-api";
import { commands } from "./bot/config/config.js";
import { handleUser, handleQuestion } from "./bot/handlers/others/index.js";
import { handleStart, handleMode, handleProfile, handlePay } from "./bot/handlers/commands/index.js";
import { handleCallback } from "./bot/handlers/callbacks/handleCallback.js";
import { handleRefLink } from "./bot/handlers/commands/handleRefLink.js";
import { succesfulPay } from "./bot/handlers/callbacks/payments/succesfulPay.js";
import { preCheckout } from "./bot/handlers/callbacks/payments/preCheckOut.js";
import "dotenv/config";

const bot = new TelegramBot(process.env.BOT_KEY!, {
  polling: true,
});

bot.setMyCommands(commands);

const commandsHandlers: { [key: string]: any } = {
  start: handleStart,
  profile: handleProfile,
  mode: handleMode,
  pay: handlePay,
  mylink: handleRefLink,
};

bot.on("text", async (message) => {
  const user = await handleUser(message);
  if (Object.keys(commandsHandlers).some((key) => message.text?.includes(key))) {
    const handlerKey = Object.keys(commandsHandlers).find((key) => message.text?.includes(key));
    const messageHandler = commandsHandlers[handlerKey as string];
    await messageHandler({ user, message, bot });
    return;
  }
  await handleQuestion({ user, message, bot });
});

bot.on("callback_query", async (ctx) => {
  const user = await handleUser(ctx.message!);
  await handleCallback({ ctx, bot, user });
});

bot.on("pre_checkout_query", async (query) => {
  await preCheckout(query, bot);
});

bot.on("successful_payment", async (msg) => {
  await succesfulPay(msg, bot);
});

/* TODO добавить крон модуль для обновелния лимитов по подписке */
