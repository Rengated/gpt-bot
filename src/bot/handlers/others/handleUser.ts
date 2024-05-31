import { Message } from "node-telegram-bot-api";
import { generateRefLink } from "./helpers/generateRefLink.js";
import prisma from "../../../prisma/index.js";
import { SubscriptionLimits } from "@prisma/client";

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

    const limits = Object.assign(
      {},
      ...(
        await prisma.subscriptionLimits.findMany({
          where: {
            subscription_id: 1,
          },
        })
      ).map((limit: SubscriptionLimits) => ({ [limit.model_id]: limit.count }))
    );

    const models = await prisma.models.findMany();

    console.log(models);

    await prisma.userLimits.createMany({
      data: [
        ...models.map((model) => ({
          chat_id: String(user!.chat_id),
          model_id: model.id,
          requests: 0,
          limit: (limits[model.id] as unknown as number) || 0,
        })),
      ],
    });

    console.log(
      ...models.map((model) => ({
        chat_id: String(user!.chat_id),
        model_id: model.id,
      }))
    );

    await prisma.referralLimits.createMany({
      data: [
        ...models.map((model) => ({
          chat_id: String(user!.chat_id),
          model_id: model.id,
        })),
      ],
    });
  }
  return user;
};
