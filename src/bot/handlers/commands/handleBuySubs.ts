import { PrismaClient } from "@prisma/client";
import { HadnlerArgs } from "../../../types/HandlerArgs";

export const handleBuySubs = async (args: HadnlerArgs) => {
  const prisma = new PrismaClient();
  const { bot, user, message } = args;
  const subs = await prisma.subscriptions.findMany();
  await bot.sendMessage(message.chat.id, "Выберите подписку для покупки", {
    reply_markup: {
      inline_keyboard: [...subs.map((sub) => [{ text: `${sub.name} по цене ${sub.price}`, callback_data: "" }])],
    },
  });
};
