import { Limits, PrismaClient, Users } from "@prisma/client";

export const reqeustAvailable = async (user: Users) => {
  const prisma = new PrismaClient();
  const limit = await prisma.limits.findFirst({
    where: {
      AND: [{ model_id: user.model_id as number }, { subscription_id: user.subscription_id as number }],
    },
  });
  const max = limit?.limits as number;

  const userRequest = await prisma.requests.findFirst({
    where: {
      AND: [{ model_id: user.model_id }, { chat_id: user.chat_id }],
    },
  });
  const userRequestCount = userRequest?.count as number;

  return userRequestCount < max;
};
