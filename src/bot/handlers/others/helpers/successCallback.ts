import { PrismaClient, Users } from "@prisma/client";

export const successCalback = async (user: Users, message?: string) => {
  const prisma = new PrismaClient();

  if (message) {
    await prisma.messages.create({
      data: {
        text: message!,
        chat_id: String(user.chat_id),
      },
    });

    const messageCount = await prisma.messages.aggregate({
      _count: {
        id: true,
      },
    });

    if (messageCount._count.id >= 5) {
      const firstMessage = await prisma.messages.findFirst();
      if (firstMessage) {
        await prisma.messages.delete({
          where: { id: firstMessage.id },
        });
      }
    }
  }

  await prisma.requests.updateMany({
    where: { AND: [{ chat_id: user.chat_id }, { model_id: user.model_id as number }] },
    data: {
      count: {
        increment: 1,
      },
    },
  });
};
