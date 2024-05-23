import md5 from "md5";

export const generateRefLink = (chat_id: number) => {
  return md5(String(chat_id));
};
