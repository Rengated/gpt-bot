import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
    await prisma.models.createMany({
        data:[
            {id: 1, name: "gpt-3.5-turbo", family: "chat"},
            {id: 2, name: "gpt-4o", family: "chat"},
        ]
    })
    await prisma.subscriptions.createMany({
        data: [
            {id: 1, name:'Базовая', price:0, duration_sub: 10000},
            {id: 2, name:'Расширенная', price:500, duration_sub: 30},
        ]
    })
    await prisma.limits.createMany({
        data:[
            {model_id: 1, subscription_id:	1, limits:	10},
            {model_id: 1, subscription_id:	2, limits:	50},
            {model_id: 2, subscription_id:	2, limits:	5},
        ]
    })
    await prisma.referralBonuses.createMany({
        data:[
            {id: 1, model_id: 1, count:	5},
            {id: 2, model_id: 2, count:	5},
        ]
    })

}
main().catch((err) => {
    console.warn("Error While generating Seed: \n", err);
    });