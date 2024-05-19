import TelegramBot from "node-telegram-bot-api";
import { commands, modelsId } from "./bot/config/config.js"
import { handleQuestion } from "./bot/handlers/handleQuestion.js";
import "dotenv/config";


import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const Bot = new TelegramBot(process.env.BOT_KEY!, {
  polling: true,
});
Bot.setMyCommands(commands);

// Обработчик текстовых сообщений
Bot.on("text", async (message) => {
  //Находим запись с чатайди пользователя
  const user = await prisma.users.findFirst({
    where: {
      chat_id: message.chat.id,
    },
  });
  console.log('user',user)
  if (!user) {
    await prisma.users.create({ data: { chat_id: message.chat.id, model_id: 1 } });
  }
    if (message.text! == "/start") {
      await Bot.sendMessage(message.chat.id, "Вы запустили бота!");
      return;
    }
    if (message.text! == "/profile") {
      await Bot.sendMessage(message.chat.id, `Ваша выбранная модель: ${user!.model_id}`);
      return;
    }
    if (message.text! =="/mode") {
      await Bot.sendMessage(message.chat.id, "Выберите модель", {
        reply_markup: {
          inline_keyboard: [...modelsId.map((model) => [{ text: model, callback_data: model }]), 
          [{ text: "Закрыть Меню", callback_data: "closeMenu" }]]
        },
      });
      return;
    }
    await handleQuestion(Bot,message, user!);
  }
);

Bot.on("callback_query", async (ctx) => {
  try {
    if (ctx.data == "closeMenu") {
      await Bot.deleteMessage(ctx.message!.chat.id, ctx.message!.message_id);
      return;
    }
    if(modelsId.includes(ctx.data!)) {
      const model = await prisma.model.findFirst({
        where: {
          name: ctx.data
        }
      })
      await prisma.users.update({
        where: { chat_id: ctx.message!.chat.id },
        data: { model_id: model?.model_id}})
      await Bot.sendMessage(ctx.message!.chat.id, `Установлена ${ctx.data} версия`);
      return;
    }
  } catch (error) {
    console.log(error);
  }
});
