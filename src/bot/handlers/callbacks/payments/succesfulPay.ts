import { PrismaClient } from "@prisma/client";
import TelegramBot from "node-telegram-bot-api";

export const succesfulPay = async (msg: TelegramBot.Message, bot: TelegramBot) => {
  const prisma = new PrismaClient();
  const transationId = Number(msg.successful_payment?.invoice_payload);
  const transaction = await prisma.transactions.findFirst({
    where: {
      id: transationId,
    },
    select: {
      subscriptions_id: true,
      chat_id: true,
      duration: true,
    },
  });

  const subscription = await prisma.subscriptions.findFirst({
    where: {
      id: transaction?.subscriptions_id,
    },
  });
  let dataEnd = new Date();
  dataEnd.setDate(dataEnd.getDate() + subscription?.duration_sub!);
  // TODO dataEnd.toIsoString кто вызовет:?
  dataEnd.toISOString;
  //обновление подписки
  await prisma.user_subscriptions.updateMany({
    where: {
      chat_id: transaction?.chat_id,
    },
    data: {
      subscription_id: transaction?.subscriptions_id,
      dateStart: new Date(),
      dateEnd: dataEnd,
    },
  });

  // обновление статуса транзакции и даты подписки

  await prisma.transactions.updateMany({
    where: {
      id: transationId!,
    },
    data: {
      status: "succesful",
      duration: subscription?.duration_sub,
    },
  });
  try {
    await bot.deleteMessage(msg.chat.id, msg.message_id - 1);
  } catch (error) {
    console.log("error", error);
  }
  console.log("Платёж успешно завершён:", msg);
  ~(await bot.sendMessage(msg.chat.id, `Спасибо за платеж! \nВы купили ${subscription?.name} подписку`));
};
