import { PrismaClient } from "@prisma/client";
import TelegramBot from "node-telegram-bot-api";

export const succesfulPay = async (msg: TelegramBot.Message, bot: TelegramBot)=>{
    const prisma = new PrismaClient(); 
    const payload = msg.successful_payment?.invoice_payload;
    const sub_id = payload!.substring(payload!.length - 1);
    const subscription = await prisma.subscriptions.findFirst({
    where: {
        id: Number(sub_id)
    },
    });
    await prisma.users.update({
    where: {
        chat_id: msg.chat.id,
    },
    data: {
        subscription_id: Number(sub_id),
    }
    });
    console.log('Платёж успешно завершён:', msg);
    await bot.sendMessage(msg.chat.id, `Спасибо за платеж! \nВы установили ${subscription?.name} подписку`);
    }