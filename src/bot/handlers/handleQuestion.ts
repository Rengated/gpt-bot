import TelegramBot, { Message } from "node-telegram-bot-api";
import { getAnswer } from "../../api/answer/getAnswer.js";
import { PrismaClient } from "@prisma/client";
import { Users } from "@prisma/client";



export const handleQuestion = async (Bot: TelegramBot,message: Message, user: Users)=>{
    
    const prisma = new PrismaClient()
    const messageWait = await Bot.sendMessage(message.chat.id, "Бот генерирует ответ...");
    const model = await prisma.model.findFirst({
        where: {
            model_id: user.model_id as number
        }
    }) 
    console.log(model?.name)
    const response = await getAnswer(message.text!, (model!.name) as string);
    await Bot.editMessageText(response, {chat_id: message.chat.id, message_id: messageWait.message_id});
}