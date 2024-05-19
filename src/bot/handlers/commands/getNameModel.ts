import { PrismaClient } from "@prisma/client";

    export const getNameModel = async(chat_id: any) =>{
        const prisma = new PrismaClient();
        try {
        const userWithModel = await prisma.users.findUnique({
            where: {
            chat_id: chat_id,
            },
            select: {
            Model: {
                select: {
                name: true, // Забираем только поле "name" из таблицы Model
                },
            },
            },
        });
        return userWithModel?.Model?.name} 
        catch (error) {
                console.error('Ошибка при получении модели:', error);
        }
    }
