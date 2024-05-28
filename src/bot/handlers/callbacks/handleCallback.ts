import { Users } from "@prisma/client";
import prisma from "../../../prisma/index.js";
import TelegramBot, { CallbackQuery } from "node-telegram-bot-api";
import "dotenv/config";

interface CallbackArgs {
  bot: TelegramBot;
  ctx: CallbackQuery;
  user: Users;
}
export const handleCallback = async (args: CallbackArgs) => {
  const { bot, user, ctx } = args;
  const chat_id = String(ctx.message?.chat.id);

  if (ctx.data == "close") {
    await bot.deleteMessage(ctx.message!.chat.id, ctx.message!.message_id);
    return;
  }
  if (ctx.message?.text == "Выберите модель") {
    await prisma.users.update({
      where: {
        chat_id: chat_id,
      },
      data: {
        model_id: Number(ctx.data),
      },
    });

    //@ts-ignore
    const modelName = ctx.message?.reply_markup?.inline_keyboard.find((item) => item[0].callback_data == ctx.data)[0].text;
    await bot.sendMessage(ctx.message!.chat.id, `Установлена ${modelName} версия`);
  }

  if (ctx.message?.text === "Выберите подписку") {
    const user = await prisma.users.findUnique({
      where: {
        chat_id: chat_id,
      },
      select: {
        chat_id: true,
        User_subscriptions: true,
      },
    });

    const subscription = await prisma.subscriptions.findFirst({
      where: {
        id: Number(ctx.data!),
      },
    });
    let duration = subscription?.duration_sub;
    console.log(duration);

    const transaction = await prisma.transactions.create({
      data: {
        createdAt: new Date(),
        chat_id: user?.chat_id,
        status: "inProcess",
        subscriptions_id: subscription!.id,
      },
    });

    if (subscription?.id !== user?.User_subscriptions[0].subscription_id) {
      const price = Math.round(subscription?.price! * 100);

      const invoice = {
        title: `Покупка подписки ${subscription?.name}⚡️`,
        description: `Стоимость подписки: ${(price! / 100).toFixed(2)} RUB`,
        stripeToken: process.env.STRIPE_TOKEN,
        payload: String(transaction.id),
        currency: "RUB",
        prices: [{ label: "Оплата", amount: price! }],
      };
      try {
        await bot.sendInvoice(ctx.message.chat.id, invoice.title, invoice.description, invoice.payload, invoice.stripeToken!, invoice.currency, invoice.prices);
      } catch (error) {
        console.error("Error sending invoice:", error);
      }
      return;
    }

    await bot.sendMessage(ctx.message!.chat.id, `У вас уже установлена ${subscription?.name} подписка`);
  }
};
