import { HandlerArgs } from "../../../types/HandlerArgs";
import prisma from "../../../prisma/index.js";

export const handlePay = async (args: HandlerArgs) => {
  const { bot, user, message } = args;

  const subscribtions = await prisma.subscriptions.findMany({
    where: {
      id: {
        gt: 1,
      },
    },
  });
  await bot.sendMessage(message.chat.id, "Выберите подписку", {
    reply_markup: {
      //@ts-ignore
      inline_keyboard: [...subscribtions!.map((sub: sub) => [{ text: `${sub.name}⚡️`, callback_data: sub.id }]), [{ text: "Закрыть Меню", callback_data: "close" }]],
    },
  });
};
