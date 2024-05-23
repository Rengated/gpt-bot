import { PrismaClient } from "@prisma/client";
import { HadnlerArgs } from "../../../types/HandlerArgs";

export const handlePay = async(args: HadnlerArgs)=>{
    const prisma = new PrismaClient();
    const { bot, user, message } = args;
    const subscribtion = await prisma.subscriptions.findMany();
    const select_subs = subscribtion.slice(1)
    await bot.sendMessage(message.chat.id, "Выберите подписку", {
    reply_markup: {
      //@ts-ignore
        inline_keyboard: [...select_subs!.map((sub: sub) => [{ text: `${sub.name}⚡️` , callback_data: sub.id }]), [{ text: "Закрыть Меню", callback_data: "close" }]],
    },
    });
}