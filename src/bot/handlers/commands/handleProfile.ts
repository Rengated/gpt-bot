import { Limits } from "@prisma/client";
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

  const userSubscription = await prisma.user_subscriptions.findFirst({
    where: {
      chat_id: user.chat_id,
    },
  });

  const subscription = await prisma.subscriptions.findFirst({
    where: {
      id: userSubscription?.subscription_id!,
    },
  });

  const currentModel = await prisma.models.findFirst({
    where: {
      id: user.model_id as number,
    },
  });

  const subLimits = await prisma.limits.findMany({
    select: {
      Models: {
        select: {
          ReferralBonuses: {
            select: {
              count: true,
            },
          },
          name: true,
        },
      },
      Subscriptions: true,
      limits: true,
    },
    where: { subscription_id: subscription?.id as number },
  });

  const requestsCount = await prisma.requests.findMany({
    select: {
      Models: {
        select: {
          name: true,
        },
      },
      count: true,
    },
    where: {
      chat_id: user.chat_id,
    },
  });

  const formatRequestCount = Object.assign(
    //@ts-ignore
    ...requestsCount.map((item) => ({
      [item.Models?.name as string]: item.count,
    }))
  );

  const countLimits = (item: Limits) => {
    //@ts-ignore
    return item.limits! + item.Models.ReferralBonuses[0].count! * referals;
  };

  let tommorowDate = new Date();
  tommorowDate.setDate(tommorowDate.getDate() + 1);
  //@ts-ignore
  const limitsText = subLimits.map((item) => `🟢${item.Models?.name}: ${formatRequestCount[item.Models!.name as string]}/${countLimits(item)}`).join("\n");
  const messageText =
    `Ваша подписка: ${subscription?.name}` +
    `\nДата окончания подписки: ${userSubscription?.dateEnd!.toLocaleDateString()}` +
    `\nКоличество ваших рефералов: ${referals}` +
    `\nЦена подписки: ${subscription?.price}р` +
    `\nТекущая модель ${currentModel?.name}` +
    `\nОсталось :\n${limitsText}` +
    `\nОбновление лимитов : ${tommorowDate.toLocaleDateString()}`;

  await bot.sendMessage(message.chat.id, messageText);
};
