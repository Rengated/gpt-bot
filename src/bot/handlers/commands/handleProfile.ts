import { PrismaClient } from "@prisma/client";
import { HadnlerArgs } from "../../../types/HandlerArgs";

export const handleProfile = async (args: HadnlerArgs) => {
  const prisma = new PrismaClient();
  const { bot, message, user } = args;

  const subscription = await prisma.subscriptions.findFirst({
    where: {
      id: user.subscription_id as number,
    },
  });

  const currentModel = await prisma.model.findFirst({
    where: {
      id: user.model_id as number,
    },
  });

  const subLimits = await prisma.limits.findMany({
    select: {
      Model: {
        select: {
          name: true,
        },
      },
      Subscriptions: true,
      limits: true,
    },
    where: { subscription_id: user.subscription_id as number },
  });

  const requestsCount = await prisma.requests.findMany({
    select: {
      Model: {
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
      [item.Model?.name as string]: item.count,
    }))
  );

  const limitsText = subLimits.map((item) => `🟢${item.Model?.name}: ${formatRequestCount[item.Model!.name as string]}/${item.limits}`).join("\n");
  const messageText = `
  🍕Ваша подписка: ${subscription?.name}
  💵Цена подписки: ${subscription?.price}р
  Текущая модель ${currentModel?.name}
  Осталось:\n${limitsText}
  `;
  await bot.sendMessage(message.chat.id, messageText);
};
