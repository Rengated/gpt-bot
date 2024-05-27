import { PrismaClient } from "@prisma/client";
import cron from "node-cron";

export const renewLimits = () => {
  // TODO внутри функции не запуск крона, сам каллбек который ты в крон передаешь
  cron.schedule("59 23 * * *", async function () {
    const prisma = new PrismaClient();
    let userCount = await prisma.requests.findMany();
    console.log(userCount);
    const count = userCount.map(async (user) => {
      await prisma.requests.updateMany({
        where: {
          chat_id: user.chat_id!,
        },
        data: {
          count: 0,
        },
      });
    });
    await prisma.$disconnect();
  });
};

// TODO крон модуль должен быть на уровне модуля бота, а не внутри него
