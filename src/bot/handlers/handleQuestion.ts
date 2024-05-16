import TelegramBot, { Message } from "node-telegram-bot-api";
import { getAnswer } from "../../api/answer/getAnswer.js";
import { User } from "@prisma/client";



export const handleQuestion = async (Bot: TelegramBot,message: Message, user: User)=>{
    const messageWait = await Bot.sendMessage(message.chat.id, "Бот генерирует ответ...");
    const response = await getAnswer(message.text!, user!.model);
    await Bot.editMessageText(response, {chat_id: message.chat.id, message_id: messageWait.message_id});
}