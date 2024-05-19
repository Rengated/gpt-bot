import { PrismaClient } from "@prisma/client";
import { HadnlerArgs } from "../../../types/HandlerArgs";

export const handelMode = async (args: HadnlerArgs) => {
  const prisma = new PrismaClient();
  const { bot, message, user } = args;

  const models = (await prisma.model.findMany()).map((item) => item.name);
  await bot.sendMessage(message.chat.id, "Выберите модель", {
    reply_markup: {
      inline_keyboard: [...models!.map((model: any) => [{ text: model, callback_data: model }]), [{ text: "Закрыть Меню", callback_data: "closeMenu" }]],
    },
  });
};
