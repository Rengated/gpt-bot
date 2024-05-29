import { PrismaClient } from "@prisma/client";
import { HandlerArgs } from "../../../types/HandlerArgs";

export const handleReset = async (args: HandlerArgs) => {
    const prisma = new PrismaClient();
    const { bot, user, message } = args;
    await prisma.messages.deleteMany({
        where:{
            chat_id: user.chat_id,
        }
    })
    await bot.sendMessage(message.chat.id, "Контекст был сброшен");
    await prisma.$disconnect();
    };
