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
  const user = await prisma.user.findFirst({
    where: {
      chatId: message.chat.id,
    },
  });
  if (!user) {
    await prisma.user.create({ data: { chatId: message.chat.id } });
  }
    if (message.text! == "/start") {
      await Bot.sendMessage(message.chat.id, "Вы запустили бота!");
      return;
    }
    if (message.text! == "/profile") {
      await Bot.sendMessage(message.chat.id, `Ваша выбранная модель: ${user!.model}`);
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
