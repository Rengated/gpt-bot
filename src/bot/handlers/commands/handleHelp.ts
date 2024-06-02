import { HandlerArgs } from "../../../types/HandlerArgs";

export const handleHelp = async (args: HandlerArgs) => {
  const { bot, user, message } = args;
  let textHelp = `<b>О боте\</b>
\nБот работает через официальный API ChatGPT от OpenAI последней версии.
\nОбновление лимитов происходит каждый день.
\n<b>Мы предоставляем 2 версии подписки:</b>
1. Базовая - доступная всем
2. Расширенная - предоставляет полный доступ ко всем услугам. Стоимость: 299 рублей.
 Вы можете приобрести подписку по команде /pay
\n\<b>Возможности бота</b>
\n<b>Контекст</b>:
-По умолчанию бот работает в режиме контекста, то есть запоминает предыдущие сообщения. 
Команда /reset сбрасывает контекст.
\n<b>Смена модели:</b>
-Выберите с помощью команды /mode одну из моделей.
\n<b>Лимиты и подписка:</b>
\nБесплатно: 
- GPT-3.5-turbo — 20 запросов в день;
\nВ подписке Расширенная ⚡️: 
- GPT-3.5-turbo — 100 запросов в день;
- GPT-4o — 25 запросов в день;
\n<b>Реферальная система:</b>
-Если вы приглашаете рефералов, вам даются бонусные запросы для соответсвуюих моделей. 
Они начинают расходоваться после того, как вы уже потратили свои дневные лимиты. 
Отследить количество бонусных запросов можно с помощью команды /bonuses.
Получить свою реферальную ссылку /mylink.

Вы можете отслеживать состояние своей подписки и количество сделанных запрсоов в разделе /profile.

Написать в поддержку — @A_Foggy. Режим работы: 10:00 - 20:00 по Мск.`;

  await bot.sendMessage(message.chat.id, textHelp, { parse_mode: "HTML" });
};
