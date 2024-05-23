import { Users } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

import TelegramBot, { CallbackQuery, LabeledPrice } from "node-telegram-bot-api";

interface CallbackArgs {
  bot: TelegramBot;
  ctx: CallbackQuery;
  user: Users;
}
export const handleCallback = async (args: CallbackArgs) => {
  const prisma = new PrismaClient();
  const { bot, user, ctx } = args;

  if (ctx.data == "close") {
    await bot.deleteMessage(ctx.message!.chat.id, ctx.message!.message_id);
    return;
  }
  if (ctx.message?.text == "Выберите модель") {
    await prisma.users.update({
      where: {
        chat_id: String(ctx.message?.chat.id),
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
    const subscription = await prisma.subscriptions.findFirst({
      where: {
        id: user.subscription_id as number,
      },
    });
    if (Number(ctx.data) == 2) {
      let stripeToken = "381764678:TEST:85676";
      let price_digit = subscription?.price;
      const amount = Math.round(price_digit! * 100);
      const currency = "RUB";
      let payload = `${ctx.message.chat.id}${Date.now()}${price_digit}`;
      let prices = [
        {
          label: "Donation",
          amount: amount!,
        },
      ];
      try {
        await bot.sendInvoice(
          ctx.message.chat.id, // ID чата
          "Оплата", // Название инвойса
          `Оплата на ${(amount! / 100).toFixed(2)} RUB`, // Описание инвойса
          payload, // Платежный payload
          stripeToken, // Токен Stripe
          currency,
          prices // Массив цен
        );

        await prisma.users.update({
          where: {
            chat_id: String(ctx.message?.chat.id),
          },
          data: {
            subscription_id: Number(ctx.data),
          },
        });
      } catch (error) {
        console.error("Error sending invoice:", error);
      }
    }

    //@ts-ignore
    const subname = ctx.message?.reply_markup?.inline_keyboard.find((item) => item[0].callback_data == ctx.data)[0].text;
    await bot.sendMessage(ctx.message!.chat.id, `Установлена ${subname} подписка`);
  }
};
