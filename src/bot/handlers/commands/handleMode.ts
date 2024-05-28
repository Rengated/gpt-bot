import { PrismaClient } from "@prisma/client";
import { HadnlerArgs } from "../../../types/HandlerArgs";

export const handleMode = async (args: HadnlerArgs) => {
  const prisma = new PrismaClient();
  const { bot, message, user } = args;

  let currentlySub = await prisma.user_subscriptions.findFirst({
    where: {
      chat_id: user.chat_id,
    },
  });

  let infoAboutCurrentlySub = await prisma.limits.findMany({
    where: {
      subscription_id: currentlySub?.subscription_id!,
    },
    include: {
      Models: true,
    },
  });

  const formattedModelsInCurrentlySub = infoAboutCurrentlySub.map((model) => model.Models);
  await bot.sendMessage(message.chat.id, "Выберите модель", {
    reply_markup: {
      //@ts-ignore
      inline_keyboard: [...formattedModelsInCurrentlySub!.map((model: Model) => [{ text: model.name, callback_data: model.id }]), [{ text: "Закрыть Меню", callback_data: "close" }]],
    },
  });
};
