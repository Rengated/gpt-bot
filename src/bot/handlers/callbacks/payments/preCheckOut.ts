import { PrismaClient } from "@prisma/client";
import TelegramBot from "node-telegram-bot-api";

export const preCheckOut = async (query: TelegramBot.PreCheckoutQuery, bot: TelegramBot)=>{
    const prisma = new PrismaClient();
    
    await prisma.transactions.create({
        data: {
            chat_id: String(query.from.id),
            payload: query.invoice_payload,
            createdAt: new Date(),
            status: "inProcess"
        },
    });
    const transaction_id = await prisma.transactions.findFirst({
        where:{
            chat_id: String(query.from.id),
        },
    })
    await prisma.transactions.updateMany({
        where:{
            id: transaction_id!.id
        },
        data:{
            payload: `${transaction_id!.id}${query.invoice_payload}`
        }
    })
    console.log('Пре-чекаут запрос:', query);
    await bot.answerPreCheckoutQuery(query.id, true)
        .then(() => {
            console.log('Платёж в обработке...');
        })
        .catch( async (error) => {
            await prisma.transactions.updateMany({
                where: {
                    chat_id: String(query.from.id),
                },
                data:{
                    status: error
                }
            })
        });
    };
    