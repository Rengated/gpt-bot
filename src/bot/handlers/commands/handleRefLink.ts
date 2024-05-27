import { HadnlerArgs } from "../../../types/HandlerArgs.js";

export const handleRefLink = async (args: HadnlerArgs) => {
  const { bot, message, user } = args;
  let botname = (await bot.getMe()).username
  const text = `Твоя реферальная ссылка <a href='https://t.me/${botname}?start=${user.referral_link}'>https://t.me/${botname}?start=${user.referral_link}</a>`;
  await bot.sendMessage(message.chat.id, text, { parse_mode: "HTML" });
};
