export const getQuestionTemplate = (message: string, model: string) => {
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