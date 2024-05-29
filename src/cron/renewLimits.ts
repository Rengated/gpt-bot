import prisma from "../prisma/index.js";

export const renewLimits = async () => {
  let limits = await prisma.userLimits.findMany();

  limits.map(async (user) => {
    await prisma.userLimits.updateMany({
      where: {
        chat_id: user.chat_id!,
      },
      data: {
        requests: 0,
      },
    });
  });
};
