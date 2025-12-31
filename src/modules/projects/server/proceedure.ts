import { prisma } from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import { messageRole, messageType } from "@/generated/prisma";
import { inngest } from "@/inngest/client";
import {generateSlug} from "random-word-slugs";

export const projectsRouter = createTRPCRouter({
    getMany: baseProcedure
        .query(async () => {
            const projects = await prisma.project.findMany({
                orderBy: {  
                    updatedAt: "desc",
                },
                // include: {fragment:true},
            });
        return projects;
        }),

    create: baseProcedure
        .input(
        z.object({
            value: z.string().min(1, { message: "Value is required" }),
        })
    )
    .mutation(async ({ input }) => {
        const createdProject = await prisma.project.create({
            data: {
                name: generateSlug(2, {
                    format: "kebab",
                }),
                messages: {
                    create: {
                        content: input.value,
                        role: messageRole.RESULT,
                        type: messageType.FRAGMENT,
                    },
                },
            },
        });
        await inngest.send({
            name: "test/hello.world",
            data: {
                value: input.value,
                projectId: createdProject.id,
            },
        });

        return createdProject;
    }),
});