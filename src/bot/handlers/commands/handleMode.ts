import { PrismaClient } from "@prisma/client";
import { HadnlerArgs } from "../../../types/HandlerArgs";

export const handleMode = async (args: HadnlerArgs) => {
  const prisma = new PrismaClient();
  const { bot, message, user } = args;

  /* TODO добавить сабскрипшн айди при фетче доступных моделей */

  const models = await prisma.models.findMany();
  await bot.sendMessage(message.chat.id, "Выберите модель", {
    reply_markup: {
      //@ts-ignore
      inline_keyboard: [...models!.map((model: Model) => [{ text: model.name, callback_data: model.id }]), [{ text: "Закрыть Меню", callback_data: "close" }]],
    },
  });
};
