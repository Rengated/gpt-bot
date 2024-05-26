/* TODO вставить ссылку на бота переменной из окружения*/

import { HadnlerArgs } from "../../../types/HandlerArgs.js";

export const handleRefLink = async (args: HadnlerArgs) => {
  const { bot, message, user } = args;

  const text = `Твоя реферальная ссылка <a href='https://t.me/SerejaLox_bot?start=${user.referral_link}'>https://t.me/SerejaLox_bot?start=${user.referral_link}</a>`;
  await bot.sendMessage(message.chat.id, text, { parse_mode: "HTML" });
};
