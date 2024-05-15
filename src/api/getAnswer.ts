import { $api } from "./index.js";





const getQuestionTemplate = (message: string, model: string) => {
  return {
    model: model,
    messages: [
      {
        role: "user",
        content: message,
      },
    ],
    stream: false,
  };
};

export const getAnswer = async (question: string, model:string): Promise<string> => {
  const template = getQuestionTemplate(question, model);
  try {
    const response = await $api.post("", template);

    return response.data.choices[0].message.content;
  } catch (err) {
    console.log(err);
    return "Please, try again";
  }
};
