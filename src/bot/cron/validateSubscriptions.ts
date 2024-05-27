import { PrismaClient } from "@prisma/client";
import cron from "node-cron";

export const validateSubscriptions = () => {
  // TODO внутри функции не запуск крона, сам каллбек который ты в крон передаешь
  cron.schedule("59 23 * * *", async function () {
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
  });
};
