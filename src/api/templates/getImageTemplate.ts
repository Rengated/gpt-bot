export const getImageTemplate = (message: string, model: string) => {
  return {
    model: model,
    model_params: {
      n: 1,
      size: "1024x1024",
    },
    prompt: message,
  };
};
