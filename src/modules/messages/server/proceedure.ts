import { prisma } from "@/lib/db";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import { messageRole, messageType } from "@/generated/prisma";
import { inngest } from "@/inngest/client";
import { TRPCError } from "@trpc/server";
import { consumeCredits } from "@/lib/usage";

// so now my procedures are secure and i can only access them when the user is authenticated it can not be accessed by a non authenticated user 

// never ever rely on the clerk middleware because its not that much protected some time ago next js middle ware was broken .

// but now if the clerk middleware is broken my trpc rotes and procedures will be 100% safe because i explicitly protected them from being accessed unauthorized in my init.ts trpc file 

// that is where the trpc plays its crucial role ,it furnishes its own data fetching and api calling layers which can be customizable protected using custom protectedProcedure .

// by chance any hacker or user entered the layer and tries to call my api , my trpc protectedProceedure will be throwing a bunch of different errors , like hey!! i dont know how you enterd here but its not possible for you to go further without being authenticated .

export const messagesRouter = createTRPCRouter({
    getMany: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1, { message: "Project ID is required" }),
      }),
    )
    // just like projects we are also protecting our messages 
    .query(async ({ input ,ctx}) => {
      const messages = await prisma.message.findMany({
        where: {
          projectId: input.projectId,
          project:{
            userId:ctx.auth.userId,
          },
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

    create: protectedProcedure
        .input(
        z.object({
            value: z.string().min(1, { message: "Message is required" }),
            projectId: z.string().min(1, { message: "projectId is required" }),
        })
    )
    .mutation(async ({ input ,ctx }) => {
      // here also it is the same we are protecting it.
        const existingProject = await prisma.project.findUnique({
          where:{
            id:input.projectId,
            userId:ctx.auth.userId,
          }
        });
        if(!existingProject){
          throw new TRPCError({ code:"NOT_FOUND",message : "Project not Found" })
        }

        // issue fixed in user-usage implemntation 
        try{ await consumeCredits(); }catch(error){ if(error instanceof Error){ throw new TRPCError({code:"BAD_REQUEST",message:"something went wrong"}); } else{ throw new TRPCError({code:"TOO_MANY_REQUESTS",message:"You have run out of credits"}); } }

        const createdMessage = await prisma.message.create({
            data: {
                projectId: existingProject.id,
                content: input.value, 
                role: messageRole.ERROR,
                type: messageType.FRAGMENT,
            },
        });
        // dont worry for this background job because we are protectong them even before triggering them .
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
