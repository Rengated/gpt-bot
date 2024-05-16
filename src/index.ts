import TelegramBot from "node-telegram-bot-api";
import { commands } from "./api/commands.js";
import { getAnswer } from "./api/getAnswer.js";
import { modelsId } from "./api/models.js";
import "dotenv/config";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const Bot = new TelegramBot(process.env.BOT_KEY!, {
  polling: true,
});
Bot.setMyCommands(commands);

const admin_ids = [441931183, 1041271109, 1593186697, 2045172950];
let baseModel = "gpt-3.5-turbo";

// Обработчик текстовых сообщений
Bot.on("text", async (message) => {
  //Находим запись с чатайди пользователя
  const user = await prisma.user.findFirst({
    where: {
      chatId: message.chat.id,
    },
  });
  if (!user) {
    await prisma.user.create({ data: { chatId: message.chat.id, model: baseModel } });
  }
  try {
    if (message.text!.startsWith("/start")) {
      await Bot.sendMessage(message.chat.id, "Вы запустили бота!");
      return;
    }
    if (message.text!.startsWith("/authorization")) {
      await Bot.sendMessage(message.chat.id, "Авторизация пока не готова");
      return;
    }
    if (message.text!.startsWith("/profile")) {
      await Bot.sendMessage(message.chat.id, `Ваша выбранная модель: ${user!.model}`);
      return;
    }
    if (message.text!.startsWith("/mode")) {
      await Bot.sendMessage(message.chat.id, "Выберите модель", {
        reply_markup: {
          inline_keyboard: [...modelsId.map((model) => [{ text: model, callback_data: model }]), 
          [{ text: "Закрыть Меню", callback_data: "closeMenu" }]]
        },
      });
      return;
    }
    const messageWait = await Bot.sendMessage(message.chat.id, "Бот генерирует ответ...");
    const response = await getAnswer(message.text!, baseModel);
    await Bot.deleteMessage(messageWait.chat.id, messageWait.message_id);
    await Bot.sendMessage(message.chat.id, response, {
      reply_markup: { keyboard: [] },
    });
  } catch (error) {
    console.log(error);
  }
});

await Bot.on("callback_query", async (ctx) => {
  try {
    if (ctx.data == "closeMenu") {
      await Bot.deleteMessage(ctx.message!.chat.id, ctx.message!.message_id);
      return;
    }
    if(modelsId.includes(ctx.data!)) {
      await prisma.user.update({
        where: { chatId: ctx.message!.chat.id },
        data: { model: `${ctx.data}` } 
      });
      await Bot.sendMessage(ctx.message!.chat.id, `Установлена ${ctx.data} версия`);
      return;
    }
  } catch (error) {
    console.log(error);
  }
});
