import { PrismaClient } from "@prisma/client";
import { HadnlerArgs } from "../../../types/HandlerArgs";

export const handelProfile = async (args: HadnlerArgs) => {
  const prisma = new PrismaClient();
  const { bot, message, user } = args;

  const subscription = await prisma.subscriptions.findFirst({
    where: {
      id: user.subscription_id as number,
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
      chat_id: user.chat_id,
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
  🍕 Ваша подписка: ${subscription?.name}\n💵 Цена подписки: ${subscription?.price}р\nОсталось:\n${limitsText}
  `;
  await bot.sendMessage(message.chat.id, messageText);
};
