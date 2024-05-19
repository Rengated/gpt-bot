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

  await prisma.users.update({
    where: {
      chat_id: ctx.message?.chat.id,
    },
    data: {
      model_id: Number(ctx.data),
    },
  });

  await bot.sendMessage(ctx.message!.chat.id, `Установлена ${ctx.message?.text} версия`);
};
