import { $api } from "../index.js";
import { getImageTemplate } from "../templates/getImageTemplate.js";
import { PrismaClient, Users } from "@prisma/client";

export const getImage = async (question: string, model: string, user: Users, callback: (user: Users) => Promise<void>): Promise<string> => {
  const prisma = new PrismaClient();
  const template = getImageTemplate(question, model);
  try {
    const response = await $api.post("images/generations", template);
    callback(user);
    return response.data.data[0].url;
  } catch (err) {
    console.log(err);
    return "";
  }
};
