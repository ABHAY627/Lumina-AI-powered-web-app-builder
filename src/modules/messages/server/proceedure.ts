import { prisma } from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import { messageRole, messageType } from "@/generated/prisma";
import { inngest } from "@/inngest/client";

export const messagesRouter = createTRPCRouter({
    getMany: baseProcedure
    .input(
      z.object({
        projectId: z.string().min(1, { message: "Project ID is required" }),
      }),
    )
    .query(async ({ input }) => {
      const messages = await prisma.message.findMany({
        where: {
          projectId: input.projectId,
        },
        include: {
            fragment: true,
        },
        orderBy: {
          updatedAt: "asc",
        },
      });
      return messages;
    }),

    create: baseProcedure
        .input(
        z.object({
            value: z.string().min(1, { message: "Message is required" }),
            projectId: z.string().min(1, { message: "projectId is required" }),
        })
    )
    .mutation(async ({ input }) => {
        const createdMessage = await prisma.message.create({
            data: {
                projectId: input.projectId,
                content: input.value,
                role: messageRole.ERROR,
                type: messageType.FRAGMENT,
            },
        });
        await inngest.send({
            name: "test/hello.world",
            data: {
                value: input.value,
                projectId: input.projectId,
            },
        });
        return createdMessage;
    }),
});
