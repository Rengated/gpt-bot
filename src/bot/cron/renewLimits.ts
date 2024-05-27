import { PrismaClient } from "@prisma/client";
import cron from "node-cron";

export const renewLimits = () => {
  cron.schedule("59 23 * * *", async function () {
    const prisma = new PrismaClient();
    let userCount = await prisma.requests.findMany()
    console.log(userCount)
    const count = userCount.map( async user =>{
        await prisma.requests.updateMany({
            where:{
                chat_id: user.chat_id!
            },
            data:{
                count: 0
            }
            })
        })
        await prisma.$disconnect();}
    )
    }
