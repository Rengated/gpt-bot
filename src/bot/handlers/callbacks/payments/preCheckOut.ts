import { PrismaClient } from "@prisma/client";
import TelegramBot, { PreCheckoutQuery } from "node-telegram-bot-api";

export const preCheckout = async (query: PreCheckoutQuery, bot: TelegramBot) => {
  const prisma = new PrismaClient();
  console.log("Пре-чекаут запрос:", query);
  await bot
    .answerPreCheckoutQuery(query.id, true)
    .then(() => {
      console.log("Платёж в обработке...");
    })
    .catch(async (error) => {
      await prisma.transactions.updateMany({
        where: {
          chat_id: String(query.from.id),
        },
        data: {
          status: "rejected",
        },
      });
    });
};
