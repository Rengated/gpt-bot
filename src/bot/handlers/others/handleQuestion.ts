import { getAnswer } from "../../../api/answer/getAnswer.js";
import { PrismaClient } from "@prisma/client";
import { HadnlerArgs } from "../../../types/HandlerArgs.js";

export const handleQuestion = async (args: HadnlerArgs) => {
  const prisma = new PrismaClient();

  const { bot, user, message } = args;
  const messageWait = await bot.sendMessage(message.chat.id, "Бот генерирует ответ...");
  const model = await prisma.model.findFirst({
    where: {
      id: user.model_id as number,
    },
  });
  console.log(model?.name);
  const response = await getAnswer(message.text!, model!.name as string);
  await bot.editMessageText(response, { chat_id: message.chat.id, message_id: messageWait.message_id });
};
