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

bot.on("text", async (message) => {
  const user = await handleUser(message);
  if (Object.keys(commandsHandlers).includes(message.text as string)) {
    const messageHandler = commandsHandlers[message.text as string];
    await messageHandler({ user, message, bot });
    return;
  }

  await handleQuestion({ user, message, bot });

  // if (message.text! == "/start") {
  //   await Bot.sendMessage(message.chat.id, "Вы запустили бота!");
  //   return;
  // }
  // if (message.text! == "/profile") {
  //   await Bot.sendMessage(message.chat.id, `Ваша выбранная модель: ${user!.model_id}`);
  //   return;
  // }
  // if (message.text! == "/mode") {
  //   await Bot.sendMessage(message.chat.id, "Выберите модель", {
  //     reply_markup: {
  //       inline_keyboard: [...modelsId.map((model) => [{ text: model, callback_data: model }]), [{ text: "Закрыть Меню", callback_data: "closeMenu" }]],
  //     },
  //   });
  //   return;
  // }
  // await handleQuestion(Bot, message, user!);
});

// Bot.on("callback_query", async (ctx) => {
//   try {
//     if (ctx.data == "closeMenu") {
//       await Bot.deleteMessage(ctx.message!.chat.id, ctx.message!.message_id);
//       return;
//     }
//     if (modelsId.includes(ctx.data!)) {
//       const model = await prisma.model.findFirst({
//         where: {
//           name: ctx.data,
//         },
//       });
//       await prisma.users.update({
//         where: { chat_id: ctx.message!.chat.id },
//         data: { model_id: model?.model_id },
//       });
//       await Bot.sendMessage(ctx.message!.chat.id, `Установлена ${ctx.data} версия`);
//       return;
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });
