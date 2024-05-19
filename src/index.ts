import TelegramBot from "node-telegram-bot-api";
import { commands } from "./bot/config/config.js";
import { handleUser, handleQuestion } from "./bot/handlers/others/index.js";
import { handleStart, handelMode, handelProfile } from "./bot/handlers/commands/index.js";
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
  await handleCallback;
  // try {
  //   if (ctx.data == "closeMenu") {
  //     await bot.deleteMessage(ctx.message!.chat.id, ctx.message!.message_id);
  //     return;
  //   }
  //   if (bot.includes(ctx.data!)) {
  //     const model = await prisma.model.findFirst({
  //       where: {
  //         name: ctx.data,
  //       },
  //     });
  //     await prisma.users.update({
  //       where: { chat_id: ctx.message!.chat.id },
  //       data: { model_id: model?.model_id },
  //     });
  //     await bot.sendMessage(ctx.message!.chat.id, `Установлена ${ctx.data} версия`);
  //     return;
  //   }
  // } catch (error) {
  //   console.log(error);
  // }
});
