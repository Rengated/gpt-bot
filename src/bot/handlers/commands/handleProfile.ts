import { PrismaClient } from "@prisma/client";
import { HadnlerArgs } from "../../../types/HandlerArgs";

export const handelProfile = async (args: HadnlerArgs) => {
  const prisma = new PrismaClient();
  const { bot, message, user } = args;

  const sub = await prisma.subscriptions.findFirst({
    where: {
      id: user.subscription_id as number,
    },
  });

  const messageText = `Ваша подписка: ${sub?.name} \n Цена подписки: ${sub?.price}`;
  await bot.sendMessage(message.chat.id, messageText);
};
