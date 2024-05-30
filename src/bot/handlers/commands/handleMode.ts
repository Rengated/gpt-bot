import { HandlerArgs } from "../../../types/HandlerArgs";
import prisma from "../../../prisma/index.js";

export const handleMode = async (args: HandlerArgs) => {
  const { bot, message, user } = args;

  let modelsInSub = await prisma.userLimits.findMany({
    where: {
      AND: [
        { chat_id: user.chat_id },
        {
          limit: {
            gt: 0,
          },
        },
      ],
    },
    include: {
      Models: true,
    },
  });

  const formattedModels = modelsInSub.map((model) => model.Models);
  await bot.sendMessage(message.chat.id, "Выберите модель", {
    reply_markup: {
      //@ts-ignore
      inline_keyboard: [...formattedModels!.map((model: Model) => [{ text: model.name, callback_data: model.id }]), [{ text: "Закрыть Меню", callback_data: "close" }]],
    },
  });
};
