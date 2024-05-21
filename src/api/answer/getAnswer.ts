import { $api } from "../index.js";
import { getQuestionTemplate } from "../templates/getQuestionTemplate.js";
import { PrismaClient, Users } from "@prisma/client";

export const getAnswer = async (question: string, model: string, user: Users, callback: (user: Users) => Promise<void>): Promise<string> => {
  const prisma = new PrismaClient();
  const template = getQuestionTemplate(question, model);
  try {
    const response = await $api.post("chat/completions", template);
    callback(user);
    return response.data.choices[0].message.content;
  } catch (err) {
    console.log(err);
    return "";
  }
};
