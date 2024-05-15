import TelegramBot from "node-telegram-bot-api";
import { commands } from "./api/commands.js";
import { getAnswer } from "./api/getAnswer.js";
import { modelsId } from "./api/models.js";
import "dotenv/config";

const Bot = new TelegramBot(process.env.BOT_KEY!, {
  polling: true,
});
Bot.setMyCommands(commands);

const admin_ids = [441931183, 1041271109, 1593186697, 2045172950];
let baseModel = 'gpt-3.5-turbo';

Bot.on("text", async (message) => {

  try{

    if (!admin_ids.includes(message.chat.id)) {
      Bot.sendMessage(message.chat.id, "Your are not authorized")
      return;
    }
    if(message.text!.startsWith('/start')) {
      await Bot.sendMessage(message.chat.id, `Вы запустили бота!`);
      return;
    }
    else if(message.text!.startsWith('/authorization')) {
      await Bot.sendMessage(message.chat.id, `Авторизация пока не готова)`);
      return;
    }
    else if(message.text!.startsWith('/mode')) {
      await Bot.sendMessage(message.chat.id, `Выберите модель`,{
        reply_markup: {
          inline_keyboard: [
            [{text: `${modelsId[0]}`, callback_data: `${modelsId[0]}`}],
            [{text: `${modelsId[1]}`, callback_data: `${modelsId[1]}`}],
            [{text: `${modelsId[2]}`, callback_data: `${modelsId[2]}`}],
            [{text: 'Закрыть Меню', callback_data: 'closeMenu'}]
          ]
    }})
    Bot.on('callback_query', async ctx => {
      try {
          switch(ctx.data) {
              case "closeMenu":
                await Bot.deleteMessage(ctx.message!.chat.id, message.message_id);
                  await Bot.deleteMessage(ctx.message!.chat.id, ctx.message!.message_id);
                  break;
              case `${modelsId[0]}`:
                await Bot.sendMessage(ctx.message!.chat.id, `Установлена ${modelsId[0]} версия`);
                break;
              case `${modelsId[1]}`:
                await Bot.sendMessage(ctx.message!.chat.id, `Установлена ${modelsId[1]} версия`);
                break;
              case `${modelsId[2]}`:
                    await Bot.sendMessage(ctx.message!.chat.id, `Установлена ${modelsId[2]} версия`);
                    break;

          }
      }
      catch(error) {
        console.log(error);
    }
    })
      return;
    }

      const messageWait = await Bot.sendMessage(message.chat.id, `Бот генерирует ответ...`);
      const response = await getAnswer(message.text!, baseModel);
      await Bot.deleteMessage(messageWait.chat.id,messageWait.message_id);
      await Bot.sendMessage(message.chat.id, response, {
        reply_markup: { keyboard: [] },
        });
      }
  
  catch(error) {

    console.log(error);

}
});
