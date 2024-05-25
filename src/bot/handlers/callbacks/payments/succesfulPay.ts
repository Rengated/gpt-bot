import { PrismaClient } from "@prisma/client";
import TelegramBot from "node-telegram-bot-api";

export const succesfulPay = async (msg: TelegramBot.Message, bot: TelegramBot)=>{
    const prisma = new PrismaClient(); 
    const payload = msg.successful_payment?.invoice_payload;
    const sub_id = payload!.substring(payload!.length - 1);
    const chat_id = String(msg.chat.id)
    const subscription = await prisma.subscriptions.findUnique({
    where: {
        id: Number(sub_id)
    },
    });
    await prisma.user_subscriptions.updateMany({
    where: {
        chat_id: chat_id,
    },
    data: {
        subscription_id: Number(sub_id),
    }
    });
    await prisma.transactions.updateMany({
        where:{
            chat_id: chat_id,
        },
        data:{
            status: 'Succesful'
        }
    })
    await bot.deleteMessage(msg.chat.id, msg.message_id-1);
    console.log('Платёж успешно завершён:', msg);
    await bot.sendMessage(msg.chat.id, `Спасибо за платеж! \nВы купили ${subscription?.name} подписку`);
    }