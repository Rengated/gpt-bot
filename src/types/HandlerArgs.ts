import { Users } from "@prisma/client";
import TelegramBot, { Message } from "node-telegram-bot-api";

export interface HandlerArgs {
  bot: TelegramBot;
  message: Message;
  user: Users;
}
