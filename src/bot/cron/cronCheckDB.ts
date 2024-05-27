import cron from "node-cron";

export const myCronJob = () => {
  cron.schedule("* * * * * *", function () {
    console.log("running a task every minute");
  });
};
