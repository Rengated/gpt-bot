import TelegramBot from "node-telegram-bot-api";

export const preCheckOut = async (query: TelegramBot.PreCheckoutQuery, bot: TelegramBot)=>{
    console.log('Пре-чекаут запрос:', query);
    await bot.answerPreCheckoutQuery(query.id, true)
        .then(() => {
            console.log('Платёж в обработке...');
        })
        .catch((error) => {
            console.error('Ошибка при подтверждении платежа:', error);
        });
    };