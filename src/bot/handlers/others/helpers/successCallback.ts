import { Users } from "@prisma/client";
import prisma from "../../../../prisma/index.js";

export const successCalback = async (user: Users, message?: string) => {
  if (message) {
    await prisma.messages.create({
      data: {
        text: message!,
        chat_id: String(user.chat_id),
      },
    });

    const messageCount = await prisma.messages.aggregate({
      where: {
        chat_id: user.chat_id,
      },
      _count: {
        id: true,
      },
    });

    if (messageCount._count.id >= 5) {
      const firstMessage = await prisma.messages.findFirst({
        where: {
          chat_id: user.chat_id,
        },
      });
      if (firstMessage) {
        await prisma.messages.delete({
          where: { id: firstMessage.id },
        });
      }
    }
  }

  const userLimits = await prisma.userLimits.findFirst({
    where: {
      model_id: user.model_id!,
      chat_id: user.chat_id,
    },
  });

  if (userLimits?.requests == userLimits?.limit) {
    await prisma.referralLimits.updateMany({
      where: {
        AND: [{ chat_id: user.chat_id }, { model_id: user.model_id! }],
      },
      data: [
        {
          count: {
            decrement: 1,
          },
        },
      ],
    });
  }
  await prisma.userLimits.updateMany({
    where: { AND: [{ chat_id: user.chat_id }, { model_id: user.model_id as number }] },
    data: {
      requests: {
        increment: 1,
      },
    },
  });
};
