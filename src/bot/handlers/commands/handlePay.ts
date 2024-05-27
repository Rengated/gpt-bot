import { PrismaClient } from "@prisma/client";
import { HadnlerArgs } from "../../../types/HandlerArgs";

export const handlePay = async (args: HadnlerArgs) => {
  const prisma = new PrismaClient();
  const { bot, user, message } = args;
  const subscribtion = await prisma.subscriptions.findMany({
    where: {
      id: {
        not: 1,
      },
    },
  });
  await bot.sendMessage(message.chat.id, "Выберите подписку", {
    reply_markup: {
      //@ts-ignore
      inline_keyboard: [...subscribtion!.map((sub: sub) => [{ text: `${sub.name}⚡️`, callback_data: sub.id }]), [{ text: "Закрыть Меню", callback_data: "close" }]],
    },
  });
};
