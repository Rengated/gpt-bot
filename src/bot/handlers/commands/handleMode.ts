import { PrismaClient } from "@prisma/client";
import { HadnlerArgs } from "../../../types/HandlerArgs";

export const handleMode = async (args: HadnlerArgs) => {
  const prisma = new PrismaClient();
  const { bot, message, user } = args;
  let currentlyModel = await prisma.user_subscriptions.findFirst({
    where:{
      chat_id: user.chat_id
    }
  })
  //находим доступные модели в конкретной подписке
  let modelsInSub = await prisma.limits.findMany({
    where:{
      subscription_id: currentlyModel?.subscription_id!
    },
    include:{
      Models: true
      }
    })
    const modelSub = modelsInSub.map(model => model.Models);

  await bot.sendMessage(message.chat.id, "Выберите модель", {
    reply_markup: {
      //@ts-ignore
      inline_keyboard: [...modelSub!.map((model: Model) => [{ text: model.name, callback_data: model.id }]), [{ text: "Закрыть Меню", callback_data: "close" }]],
    },
  });
};
