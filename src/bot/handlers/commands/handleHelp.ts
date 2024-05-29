import { HandlerArgs } from "../../../types/HandlerArgs";

export const handleHelp = async (args: HandlerArgs) => {
    const { bot, user, message } = args;
    let currentDate = new Date().toLocaleDateString()
    let textHelp = `\*О боте\*
    \nБот работает через официальный API ChatGPT от OpenAI последней версии.
    \nОбновление лимитов каждый день.
    \nМы предоставляем систему рефералов, приведи друга, пригласив его по ссылке /mylink и получи ПОЖИЗНЕННОЕ расширение лимитов для gpt-3.5-turbo на 5 запросов, а для gpt-4o на 2
    \nНа ${currentDate} мы предоставляем 2 версии подписки:
    1. Базовая - доступная всем
    2. Расширенная - предоставляет полный доступ ко всем услугам. Вы можете приобрести подписку по команде /pay
    \n\*Возможности бота\*
    \nКонтекст:
    По умолчанию бот работает в режиме контекста, то есть запоминает предыдущие сообщения. Это сделано для того, чтобы можно было уточнить дополнения или вести диалог в рамках одной темы. Команда /reset сбрасывает контекст.
    \nРаспознавание изображений:
(в разработке, мы уведомим вас об обновлении)
    Вы можете сделать запрос прикрепив изображение. Бот распознает изображение и ответит на ваш запрос. Для этого прикрепите изображение к запросу.
    \nГенерация изображений (временно недоступна)
    - Перейдите с помощью команды /mode на одну из моделей по генерации изображений и задайте свой вопрос
    - Генерация доступна на русском и английском языках у соответствующих моделей.
    \n\*Лимиты и подписка\*
    \nБесплатно: 
    - GPT-3.5-turbo — 20 запросов в день;
    \nВ подписке Расширенная ⚡️: 
    - GPT-3.5-turbo — 100 запросов в день;
    - GPT-4o — 25 запросов в день;

Вы можете отслеживать состояние в разделе /profile.

Написать в поддержку — @A_Foggy. Режим работы: 10:00 - 20:00 по мск.`
    await bot.sendMessage(message.chat.id, textHelp);
}