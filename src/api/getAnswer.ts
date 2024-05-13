import { $api } from "./index.js";

const getQuestionTemplate = (message: string) => {
  return {
    model: "gpt-4-0125-preview",
    messages: [
      {
        role: "user",
        content: message,
      },
    ],
    stream: false,
  };
};

export const getAnswer = async (question: string): Promise<string> => {
  const template = getQuestionTemplate(question);
  try {
    const response = await $api.post("", template);

    return response.data.choices[0].message.content;
  } catch (err) {
    console.log(err);
    return "Please, try again";
  }
};
