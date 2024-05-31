import { UserLimits } from "@prisma/client";
import { HandlerArgs } from "../../../types/HandlerArgs";
import prisma from "../../../prisma/index.js";

export const handleProfile = async (args: HandlerArgs) => {
  const { bot, message, user } = args;

  const referals = (
    await prisma.referrals.aggregate({
      where: {
        chat_id: user.chat_id,
      },
      _count: {
        id: true,
      },
    })
  )._count.id;

  const userSubscription = await prisma.userSubscriptions.findFirst({
    where: {
      chat_id: user.chat_id,
    },
    include: {
      Subscriptions: true,
    },
  });

  const currentModel = await prisma.models.findFirst({
    where: {
      id: user.model_id as number,
    },
  });

  const userLimits = await prisma.userLimits.findMany({
    include: {
      Models: {
        include: {
          ReferralBonuses: true,
        },
      },
    },
    where: {
      chat_id: user.chat_id,
      limit: {
        gt: 0,
      },
    },
  });
  let tommorowDate = new Date();
  tommorowDate.setDate(tommorowDate.getDate() + 1);

  //@ts-ignore
  const limitsText = userLimits.map((item: UserLimits) => `🟢${item.Models?.name}: ${item.requests}/${item.limit}`).join("\n");
  const messageText =
    `Ваша подписка: ${userSubscription?.Subscriptions?.name}` +
    `\nДата окончания подписки: ${userSubscription?.dateEnd!.toLocaleDateString()}` +
    `\nКоличество ваших рефералов: ${referals}` +
    `\nЦена подписки: ${userSubscription?.Subscriptions?.price}р` +
    `\nТекущая модель ${currentModel?.name}` +
    `\nОсталось :\n${limitsText}` +
    `\nОбновление лимитов : ${tommorowDate.toLocaleDateString()}`;

  await bot.sendMessage(message.chat.id, messageText);
};
