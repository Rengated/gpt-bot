import { Limits, PrismaClient } from "@prisma/client";
import { HadnlerArgs } from "../../../types/HandlerArgs";
import { it } from "node:test";

export const handleProfile = async (args: HadnlerArgs) => {
  const prisma = new PrismaClient();
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
  const referalBon = await prisma.referralBonuses.findFirst({
    where: {
      model_id: user.model_id,
    },
  });
  console.log("ref", referalBon);
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
  // console.log('sub',subLimits)
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

    //@ts-ignore
    return item.limits! + item.Models.ReferralBonuses[0].count! * referals;
  };

  /* TODO добавить длительность подписки и дату обновления лимитов */

  //@ts-ignore
  const limitsText = subLimits.map((item) => `🟢${item.Models?.name}: ${formatRequestCount[item.Models!.name as string]}/${countLimits(item)}`).join("\n");
  const messageText =
    `Ваша подписка: ${subscription?.name}` +
    `\nКоличество ваших рефералов: ${referals}` +
    `\nЦена подписки: ${subscription?.price}р` +
    `\nТекущая модель ${currentModel?.name}` +
    `\nОсталось :\n${limitsText}`;

  await bot.sendMessage(message.chat.id, messageText);
};
