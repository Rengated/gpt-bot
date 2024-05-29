import prisma from "../prisma/index.js";

export const validateSubscriptions = async () => {
  let userSubs = await prisma.user_subscriptions.findMany();
  userSubs.map(async (usersbs) => {
    let currentlyDate = new Date();
    let diff = usersbs.dateEnd!.getTime() - currentlyDate.getTime();
    if (diff <= 0) {
      await prisma.user_subscriptions.update({
        where: {
          chat_id: usersbs.chat_id!,
        },
        data: {
          subscription_id: 1,
          dateStart: currentlyDate,
          dateEnd: new Date(2030, 1, 19),
        },
      });
    }
  });
  await prisma.$disconnect();
};
