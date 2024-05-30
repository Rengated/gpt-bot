import { HandlerArgs } from "../../../types/HandlerArgs.js";
import prisma from "../../../prisma/index.js";
import { SubscriptionLimits } from "@prisma/client";
export const handleStart = async (args: HandlerArgs) => {
  const { bot, user, message } = args;
  const [_, refLink] = message.text!.split(" ");

  await bot.sendMessage(message.chat.id, "Вы успешно запустили бота");

  if (!refLink) {
    return;
  }

  // Пользователь который пригласил реферала
  const offeringUser = await prisma.users.findFirst({
    include: {
      UserSubscriptions: true,
    },
    where: {
      referral_link: refLink,
    },
  });

  if (!offeringUser || offeringUser?.chat_id == user.chat_id) {
    return;
  }

  const alreadyExists = !!(await prisma.referrals.findFirst({
    where: {
      AND: [{ chat_id: offeringUser!.chat_id }, { referral_id: user.chat_id }],
    },
  }));

  //Если приглащающий реферал для этого юзера
  const offeringUserIsReferal = !!(await prisma.referrals.findFirst({
    where: {
      AND: [{ chat_id: user!.chat_id }, { referral_id: offeringUser.chat_id }],
    },
  }));

  if (alreadyExists || offeringUserIsReferal) {
    return;
  }

  await prisma.referrals.create({
    data: {
      chat_id: offeringUser!.chat_id,
      referral_id: user.chat_id,
    },
  });

  const bonuses = await prisma.referralBonuses.findMany();

  const limits = Object.assign(
    {},
    ...(
      await prisma.subscriptionLimits.findMany({
        where: {
          subscription_id: offeringUser.UserSubscriptions?.subscription_id!,
        },
      })
    ).map((limit: SubscriptionLimits) => ({ [limit.model_id]: limit.count }))
  );

  const referals = (
    await prisma.referrals.aggregate({
      where: {
        chat_id: offeringUser.chat_id,
      },
      _count: {
        id: true,
      },
    })
  )._count.id;

  for (const bonus of bonuses) {
    await prisma.userLimits.updateMany({
      data: {
        limit: (limits[bonus.model_id!] as unknown as number) || 0 + bonus.count! * referals,
      },
      where: {
        AND: [{ chat_id: offeringUser.chat_id }, { model_id: bonus.model_id! }],
      },
    });
  }
};
