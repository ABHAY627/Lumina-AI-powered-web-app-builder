import { prisma } from "@/lib/db";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import { messageRole, messageType } from "@/generated/prisma";
import { inngest } from "@/inngest/client";
import {generateSlug} from "random-word-slugs";
import { tr } from "date-fns/locale";
import { TRPCError } from "@trpc/server";


// wherever we are using ct.auth.userId we are protecting that seagment to be accessed unauthorized ,
// mtlb if userId not found then im sorry i can't show the projects 
// mtlb thik hai agar to auth ka middleware tod ke meri website mein ghus bhi gaya to bhi agar tu authenticated nahi hai tu projects dekhne , access karne ko, aur banane ko nahi milenge .
// aur joki fir usse pehle hamari saari api routing trpc se hi ho rkhi hai to fer vo sab bhi uss hacker ke liye inaccessible ho jaega 
// matlab full on security .

// all thanks to protectedProceedure which we created explcitly.

export const projectsRouter = createTRPCRouter({
    getOne: protectedProcedure
        .input(z.object({
            id: z.string().min(1, { message: "Id is required" }),
        }))
        .query(async ({ input ,ctx}) => {
            const existingProject = await prisma.project.findUnique({
            where: {
                id: input.id,
                userId:ctx.auth.userId,
            },
            });
            if(!existingProject){
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: `Project with id ${input.id} not found`,
                }); 
            }
            return existingProject;
        }),

    getMany: protectedProcedure
        .query(async ({ctx}) => {
            const projects = await prisma.project.findMany({
                // added where while authentication because we are loading only authenticated user's projects.
                where:{
                    userId:ctx.auth.userId,
                },
                orderBy: {      
                    updatedAt: "desc",
                },
                // include: {fragment:true},
            });
        return projects;
        }),

    create: protectedProcedure
        .input(
        z.object({
            value: z.string().min(1, { message: "Value is required" }),
        })
    )
    // ctx introduce kiya kyuuonki we are using a protected proceedure.
    .mutation(async ({ input ,ctx}) => {
        const createdProject = await prisma.project.create({
            data: {
                userId:ctx.auth.userId,
                name: generateSlug(2, {
                    format: "kebab",
                }),
                messages: {
                    create: {
                        content: input.value,
                        role: messageRole.ERROR,
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