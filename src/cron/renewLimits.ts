import { PrismaClient } from "@prisma/client";

export const renewLimits = async () => {
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
};
