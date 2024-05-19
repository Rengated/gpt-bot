import { Message } from "node-telegram-bot-api";
import { PrismaClient, Users } from "@prisma/client";

const prisma = new PrismaClient();

export const handleUser = async (message: Message) => {
  let user = await prisma.users.findFirst({
    where: {
      chat_id: message.chat.id,
    },
  });

  if (!user) {
    user = await prisma.users.create({
      data: {
        chat_id: message.chat.id,
        model_id: 1,
        subscription_id: 1,
      },
    });
    const models = await prisma.model.findMany();
    await prisma.requests.createMany({
      data: [
        ...models.map((model) => ({
          chat_id: message.chat.id,
          count: 0,
          model_id: model.id,
        })),
      ],
    });
  }
  return user;
};
