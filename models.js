import axios from "axios";
import "dotenv";
import { it } from "node:test";

let config = {
  method: "get",
  maxBodyLength: Infinity,
  url: "https://api.theb.ai/v1/models",
  // url: 'https://api.baizhi.ai/v1/models',
  headers: {
    Authorization: `Bearer sk-C5fmce7FJIlYNxYx9eRyVGhlQi5BSQxTmbKQiYW9DhbkxGdG`,
  },
};

axios
  .request(config)
  .then((response) => {
    console.log(
      JSON.stringify(
        response.data.data.filter((item) => item.id.includes("gpt"))
      )
    );
  })
  .catch((error) => {
    console.log(error);
  });
