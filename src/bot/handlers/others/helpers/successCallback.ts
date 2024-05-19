import { PrismaClient, Users } from "@prisma/client";

export const successCalback = async (user: Users) => {
  const prisma = new PrismaClient();
  await prisma.requests.updateMany({
    where: { AND: [{ chat_id: user.chat_id as number }, { model_id: user.model_id as number }] },
    data: {
      count: {
        increment: 1,
      },
    },
  });
};
