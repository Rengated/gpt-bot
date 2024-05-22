import { PrismaClient, Users } from "@prisma/client";

export const getQuestionTemplate = async (message: string, model: string, user: Users) => {
  const prisma = new PrismaClient();
  let messages =
    (await prisma.messages.findMany({
      where: {
        chat_id: user.chat_id,
      },
    })) || [];
  return {
    model: model,
    messages: [
      ...messages.map((message) => ({
        role: "user",
        content: message.text,
      })),
      {
        role: "user",
        content: message,
      },
    ],
    stream: false,
  };
};
