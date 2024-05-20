import { Users } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

import TelegramBot, { CallbackQuery } from "node-telegram-bot-api";

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
  if (ctx.message?.text == "Выберите подписку"){
    await prisma.users.update({
      where: {
        chat_id: ctx.message?.chat.id,
      },
      data: {
        subscription_id: Number(ctx.data),
      },
    });
  
    //@ts-ignore
    const modelName = ctx.message?.reply_markup?.inline_keyboard.find((item) => item[0].callback_data == ctx.data)[0].text;
    await bot.sendMessage(ctx.message!.chat.id, `Установлена ${modelName} подписка`);
  }
  
};
