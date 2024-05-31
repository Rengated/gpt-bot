import { Users } from "@prisma/client";
import prisma from "../../../../prisma/index.js";

export const reqeustAvailable = async (user: Users) => {
  const userLimits = await prisma.userLimits.findFirst({
    where: {
      model_id: user.model_id!,
      chat_id: user.chat_id,
    },
  });

  const referralLimits = await prisma.referralLimits.findFirst({
    where: { model_id: user.model_id!, chat_id: user.chat_id },
  });

  return userLimits?.requests! < userLimits?.limit! || referralLimits?.count;
};
