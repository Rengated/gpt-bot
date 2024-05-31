import { HandlerArgs } from "../../../types/HandlerArgs";
import prisma from "../../../prisma/index.js";

export const handleBonuses = async (args: HandlerArgs) => {
  const { bot, user, message } = args;

  const bonusesLimits = await prisma.referralLimits.findMany({
    where: {
      chat_id: user.chat_id,
    },
    include: {
      Models: true,
    },
  });

  const textMessage = `Ваши бонусны лимиты` + bonusesLimits.map((limit) => `\nМодель ${limit.Models.name}: ${limit.count}`);
  await bot.sendMessage(message.chat.id, textMessage);
};
