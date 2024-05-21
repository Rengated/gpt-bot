import axios from "axios";
import "dotenv/config";

let modelsId = [];
let config = {
  method: "get",
  maxBodyLength: Infinity,
  url: "https://api.theb.ai/v1/models",
  // url: 'https://api.baizhi.ai/v1/models',
  headers: {
    Authorization: `Bearer ${process.env.KEY}`,
  },
};

axios
  .request(config)
  .then((response) => {
    modelsId = response.data.data.map((model) => ({ name: model.id, family: model.family }));
  })
  .catch((error) => {
    console.log(error);
  });

setTimeout(() => {
  console.log("modelsId:", modelsId); // Пример использования глобальной переменной
}, 5000);

export { modelsId };
