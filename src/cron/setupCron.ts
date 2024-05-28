import { renewLimits } from "./renewLimits.js";
import { validateSubscriptions } from "./validateSubscriptions.js";
import cron from "node-cron";

export const setupCron = () => {
  cron.schedule("59 23 * * *", validateSubscriptions);
  cron.schedule("59 23 * * *", renewLimits);
};
