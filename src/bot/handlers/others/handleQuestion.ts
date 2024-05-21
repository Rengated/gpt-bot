import { getAnswer } from "../../../api/answer/getAnswer.js";
import { PrismaClient } from "@prisma/client";
import { HadnlerArgs } from "../../../types/HandlerArgs.js";
import { reqeustAvailable } from "./helpers/reqeustAvailable.js";
import { successCalback } from "./helpers/successCallback.js";
import { getImage } from "../../../api/answer/getImage.js";

export const handleQuestion = async (args: HadnlerArgs) => {
  const prisma = new PrismaClient();
  const { bot, user, message } = args;
  const messageWait = await bot.sendMessage(message.chat.id, "Бот генерирует ответ...");

  const model = await prisma.model.findFirst({
    where: {
      id: user.model_id as number,
    },
  });

  let response;
  if (await reqeustAvailable(user)) {
    if (model?.family == "chat") {
      response = await getAnswer(message.text!, model!.name as string, user, successCalback); //обновляет данные по кол-ву запросов
    }

    if (model?.family == "image") {
      response = await getImage(message.text!, model!.name as string, user, successCalback); //обновляет данные по кол-ву запросов
    }
  } else {
    response = "Вы превысили лимит запросов";
  }

  if (!response) {
    await bot.editMessageText("Произошла ошибка, попробуйте еще раз, попозже", { chat_id: message.chat.id, message_id: messageWait.message_id });
    return;
  }

  if (model?.family == "chat") {
    await bot.editMessageText(response as string, { chat_id: message.chat.id, message_id: messageWait.message_id });
    return;
  }

  await bot.deleteMessage(message.chat.id, messageWait.message_id);
  await bot.sendPhoto(message.chat.id, response as string);
};
