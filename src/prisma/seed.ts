import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  await prisma.models.createMany({
    data: [
      { id: 1, name: "gpt-3.5-turbo", family: "chat" },
      { id: 2, name: "gpt-4o", family: "chat" },
    ],
  });
  await prisma.subscriptions.createMany({
    data: [
      { id: 1, name: "Базовая", price: 0, duration: 10000 },
      { id: 2, name: "Расширенная", price: 299, duration: 30 },
    ],
  });
  await prisma.subscriptionLimits.createMany({
    data: [
      { model_id: 1, subscription_id: 1, count: 20 },
      { model_id: 1, subscription_id: 2, count: 100 },
      { model_id: 2, subscription_id: 2, count: 25 },
    ],
  });

  await prisma.referralBonuses.createMany({
    data: [
      { id: 1, model_id: 1, count: 5 },
      { id: 2, model_id: 2, count: 2 },
    ],
  });
};
main().catch((err) => {
  console.warn("Error While generating Seed: \n", err);
});
