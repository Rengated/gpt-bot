import { HandlerArgs } from "../../../types/HandlerArgs";
import prisma from "../../../prisma/index.js";
import { Models } from "@prisma/client";

export const handleMode = async (args: HandlerArgs) => {
  const { bot, message, user } = args;

//заполняет массив объектами, где лимиты не 0
  let modelsInUserLimits = await prisma.userLimits.findMany({
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
  let modelsInReferalLimits = await prisma.referralLimits.findMany({
    where: {
      AND: [
        { chat_id: user.chat_id },
        {
          count: {
            gt: 0,
          },
        },
      ],
    },
    include: {
      Models: true,
    },
  });


  const formattedModdelsInUserLimits = modelsInUserLimits.map((model) => model.Models);
  const formattedModdelsInReferalLimits = modelsInReferalLimits.map((model) => model.Models);

  const mergedArray = [...formattedModdelsInReferalLimits, ...formattedModdelsInUserLimits];
  var mergedModels: Models[] = [];

  for (const model of mergedArray) {
    if (mergedModels.findIndex((item) => item.name === model.name) === -1) {
      mergedModels.push(model);
    }
  }

  await bot.sendMessage(message.chat.id, "Выберите модель", {
    reply_markup: {
      //@ts-ignore
      inline_keyboard: [...mergedModels!.map((model: Model) => [{ text: model.name, callback_data: model.id }]), [{ text: "Закрыть Меню", callback_data: "close" }]],
    },
  });
};
