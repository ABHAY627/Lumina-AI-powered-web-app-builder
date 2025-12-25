import { prisma } from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import { messageRole, messageType } from "@/generated/prisma";
import { inngest } from "@/inngest/client";

export const messagesRouter = createTRPCRouter({
    getMany: baseProcedure
        .query(async () => {
            const messages = await prisma.message.findMany({
                orderBy: {  
                    updatedAt: "desc",
                },
                // include: {fragment:true},
            });
            return messages;
        }),

    create: baseProcedure
        .input(
        z.object({
            value: z.string().min(1, { message: "Message is required" }),
        })
    )
    .mutation(async ({ input }) => {
        const newMessage = await prisma.message.create({
            data: {
                content: input.value,
                role: messageRole.RESULT,
                type: messageType.FRAGMENT,
            },
        });
    await inngest.send({
        name: "test/hello.world",
        data: { value: input.value },
    });
    return { success: true };
    // return newMessage;
    }),
});
