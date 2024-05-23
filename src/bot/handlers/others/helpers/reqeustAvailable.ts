import { PrismaClient, Users } from "@prisma/client";

export const reqeustAvailable = async (user: Users) => {
  let bonus = 0;
  const prisma = new PrismaClient();

  const referals = (
    await prisma.referrals.aggregate({
      where: {
        chat_id: user.chat_id,
      },
      _count: {
        id: true,
      },
    })
  )._count.id;

  if (referals) {
    bonus = (
      await prisma.referralBonuses.findFirst({
        where: {
          model_id: user.model_id,
        },
      })
    )?.count!;
  }

  const userSubscription = await prisma.user_subscriptions.findFirst({
    where: {
      chat_id: user.chat_id,
    },
  });

  const limit = await prisma.limits.findFirst({
    where: {
      AND: [{ model_id: user.model_id as number }, { subscription_id: userSubscription!.id }],
    },
  });
  const max = limit?.limits! + bonus;

  const userRequest = await prisma.requests.findFirst({
    where: {
      AND: [{ model_id: user.model_id }, { chat_id: user.chat_id }],
    },
  });
  const userRequestCount = userRequest?.count as number;

  return userRequestCount < max;
};
