import { UserSubscriptions } from "@prisma/client";
import prisma from "../prisma/index.js";

export const validateSubscriptions = async () => {
  let userSubs = await prisma.userSubscriptions.findMany();
  userSubs.map(async (usersbs: UserSubscriptions) => {
    let currentDate = new Date();
    let diff = usersbs.dateEnd!.getTime() - currentDate.getTime();
    if (diff <= 0) {
      await prisma.userSubscriptions.update({
        where: {
          chat_id: usersbs.chat_id!,
        },
        data: {
          subscription_id: 1,
          dateStart: currentDate,
          dateEnd: new Date(2030, 1, 19),
        },
      });

      const limits = await prisma.subscriptionLimits.findMany({
        where: {
          subscription_id: 1,
        },
      });

      for (const limit of limits) {
        await prisma.userLimits.updateMany({
          where: { model_id: limit.model_id },
          data: {
            limit: limit.count,
          },
        });
      }
    }
  });
};
