import { PrismaClient } from "@prisma/client";
import { HadnlerArgs } from "../../../types/HandlerArgs";

export const handleProfile = async (args: HadnlerArgs) => {
  const prisma = new PrismaClient();
  const { bot, message, user } = args;

  const userSubscription = await prisma.user_subscriptions.findFirst({
    where: {
      chat_id: user.chat_id,
    },
  });

  const subscription = await prisma.subscriptions.findFirst({
    where: {
      id: userSubscription?.id,
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
      chat_id: String(user.chat_id),
    },
  });

  const formatRequestCount = Object.assign(
    //@ts-ignore
    ...requestsCount.map((item) => ({
      [item.Models?.name as string]: item.count,
    }))
  );

  const limitsText = subLimits.map((item) => `🟢${item.Models?.name}: ${formatRequestCount[item.Models!.name as string]}/${item.limits}`).join("\n");
  const messageText = `
  🍕Ваша подписка: ${subscription?.name}
  💵Цена подписки: ${subscription?.price}р
  Текущая модель ${currentModel?.name}
  Осталось:\n${limitsText}
  `;
  await bot.sendMessage(message.chat.id, messageText);
};
