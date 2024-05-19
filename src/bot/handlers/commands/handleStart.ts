import { HadnlerArgs } from "../../../types/HandlerArgs";

export const handleStart = async (args: HadnlerArgs) => {
  const { bot, user, message } = args;
  await bot.sendMessage(message.chat.id, "Вы успешно запустили бота");
};
