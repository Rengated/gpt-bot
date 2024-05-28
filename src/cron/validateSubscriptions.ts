import { PrismaClient } from "@prisma/client";

export const validateSubscriptions = async () => {
    const prisma = new PrismaClient();
    let userSubs = await prisma.user_subscriptions.findMany();
    const userSub = userSubs.map(async (usersbs) => {
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
