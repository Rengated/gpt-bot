import { Users } from "@prisma/client";
import { HadnlerArgs } from "../../../types/HandlerArgs.js";
import TelegramBot, { CallbackQuery } from "node-telegram-bot-api";

interface CallbackArgs {
  bot: TelegramBot;
  ctx: CallbackQuery;
  user: Users;
}
export const handleCallback = (args: CallbackArgs) => {};
