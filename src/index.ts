import TelegramBot from "node-telegram-bot-api";
import { getAnswer } from "./api/getAnswer.js";
import "dotenv/config";

const Bot = new TelegramBot(process.env.BOT_KEY!, {
  polling: true,
});

const admin_ids = [441931183, 1041271109, 1593186697];
Bot.on("text", async (message) => {
  if (!admin_ids.includes(message.chat.id)) {
    Bot.sendMessage(message.chat.id, "Your are not authorized", {
      reply_markup: { keyboard: [] },
    });
  }

  const response = await getAnswer(message.text!);

  await Bot.sendMessage(message.chat.id, response, {
    reply_markup: { keyboard: [] },
  });
});
