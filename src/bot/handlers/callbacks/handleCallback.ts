import { Users } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

import TelegramBot, { CallbackQuery, LabeledPrice} from "node-telegram-bot-api";

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
  if (ctx.message?.text == 'Выберите модель'){
    await prisma.users.update({
      where: {
        chat_id: ctx.message?.chat.id,
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
    const subscription_user = await prisma.subscriptions.findFirst({
      where: {
        id: user.subscription_id as number,
      },
    });
    const subscription = await prisma.subscriptions.findFirst({
      where: {
        id: Number(ctx.data!)
      },
    });
    const subname = subscription?.name

    if (subname !== subscription_user?.name ) {
      const price_digit = subscription?.price;
      const amount = Math.round(price_digit!*100);

      const invoice = {
        title: `Покупка подписки ${subname}⚡️`,
        description: `Стоимость подписки: ${(amount!/100).toFixed(2)} RUB`,
        payload: `${ctx.message.chat.id}${Date.now()}${price_digit}${subscription?.id}`,
        stripeToken: '381764678:TEST:85676',
        currency: 'RUB',
        prices: [{label: "Оплата", amount: amount!, }]
      }

    try{
      await bot.sendInvoice(
        ctx.message.chat.id,
        invoice.title,                         
        invoice.description,  
        invoice.payload,
        invoice.stripeToken,
        invoice.currency,
        invoice.prices
      );
    }catch (error) {
      console.error('Error sending invoice:', error);
    }}
    else{
        bot.sendMessage(ctx.message!.chat.id, `У вас уже установлена ${subscription_user?.name} подписка`);
    }
  }
}




