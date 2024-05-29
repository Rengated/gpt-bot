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

    await prisma.userSubscriptions.create({
      data: {
        chat_id: String(message.chat.id),
        subscription_id: 1,
        dateStart: new Date(),
        dateEnd: new Date(2030, 1, 19),
      },
    });

    const limits = await prisma.subscriptionLimits.findMany({
      where: {
        subscription_id: 1,
      },
    });

    await prisma.userLimits.createMany({
      data: [
        ...limits.map((limit) => ({
          chat_id: String(user!.chat_id),
          model_id: limit.model_id,
          requests: 0,
          limit: limit.count,
        })),
      ],
    });
  }
  return user;
};
