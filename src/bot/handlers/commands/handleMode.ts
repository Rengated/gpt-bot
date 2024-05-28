import { PrismaClient } from "@prisma/client";
import { HandlerArgs } from "../../../types/HandlerArgs";

export const handleMode = async (args: HandlerArgs) => {
  const prisma = new PrismaClient();
  const { bot, message, user } = args;

  let currentSub = await prisma.user_subscriptions.findFirst({
    where: {
      chat_id: user.chat_id,
    },
  });

  let modelsInSub = await prisma.limits.findMany({
    where: {
      subscription_id: currentSub?.subscription_id!,
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
