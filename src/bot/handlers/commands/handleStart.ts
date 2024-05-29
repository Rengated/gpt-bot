import { HandlerArgs } from "../../../types/HandlerArgs.js";
import prisma from "../../../prisma/index.js";
export const handleStart = async (args: HandlerArgs) => {
  const { bot, user, message } = args;
  const [_, refLink] = message.text!.split(" ");

  await bot.sendMessage(message.chat.id, "Вы успешно запустили бота");

  if (!refLink) {
    return;
  }

  const offeringUser = await prisma.users.findFirst({
    where: {
      referral_link: refLink,
    },
  });

  if (!offeringUser) {
    return;
  }

  const exists = !!(await prisma.referrals.findFirst({
    where: {
      AND: [{ chat_id: offeringUser!.chat_id }, { referral_id: user.chat_id }],
    },
  }));

  const offeringUserIsReferal = !!(await prisma.referrals.findFirst({
    where: {
      AND: [{ chat_id: user!.chat_id }, { referral_id: offeringUser.chat_id }],
    },
  }));

  if (exists || offeringUserIsReferal) {
    return;
  }

  await prisma.referrals.create({
    data: {
      chat_id: offeringUser!.chat_id,
      referral_id: user.chat_id,
    },
  });
};
