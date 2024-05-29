import { Message } from "node-telegram-bot-api";
import { generateRefLink } from "./helpers/generateRefLink.js";
import prisma from "../../../prisma/index.js";

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
        referral_link: generateRefLink(message.chat.id),
      },
    });
    await prisma.user_subscriptions.create({
      data: {
        chat_id: String(message.chat.id),
        subscription_id: 1,
        dateStart: new Date(),
        dateEnd: new Date(2030, 1, 19),
      },
    });

    const models = await prisma.models.findMany();
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
