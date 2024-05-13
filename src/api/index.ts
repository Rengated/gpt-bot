import axios from "axios";
import "dotenv/config";

export const $api = axios.create({
  baseURL: "https://api.theb.ai/v1/chat/completions",
  headers: {
    Authorization: `Bearer ${process.env.KEY}`,
    "Content-Type": "application/json",
  },
});
