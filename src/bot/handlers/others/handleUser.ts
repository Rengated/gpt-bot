import { Message } from "node-telegram-bot-api";
import { PrismaClient, Users } from "@prisma/client";
import { generateRefLink } from "./helpers/generateRefLink.js";

const prisma = new PrismaClient();

export const handleUser = async (message: Message) => {
  let user = await prisma.users.findFirst({
    where: {
      chat_id: String(message.chat.id),
    },
  });

  if (!user) {
    user = await prisma.users.create({
      data: {
        chat_id: String(message.chat.id),
        model_id: 1,
        subscription_id: 1,
        referral_link: generateRefLink(message.chat.id),
      },
    });

    await prisma.referals.
    const models = await prisma.model.findMany();
    await prisma.requests.createMany({
      data: [
        ...models.map((model) => ({
          chat_id: String(message.chat.id),
          count: 0,
          model_id: model.id,
        })),
      ],
    });
  }
  return user;
};
