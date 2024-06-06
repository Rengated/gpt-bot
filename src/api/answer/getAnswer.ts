import { $api } from "../index.js";
import { getQuestionTemplate } from "../templates/getQuestionTemplate.js";
import { Users } from "@prisma/client";

export const getAnswer = async (question: string, model: string, user: Users, callback: any): Promise<string> => {
  const template = await getQuestionTemplate(question, model, user);
  try {
    const response = await $api.post("chat/completions", template);
    callback(user, question); //регулируем кол-во запросов (+-)
    let answer = response.data.choices[0].message.content
    return answer;
  } catch (err) {
    return "";
  }
};
