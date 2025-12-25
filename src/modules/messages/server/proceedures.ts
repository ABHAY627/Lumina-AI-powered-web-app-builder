import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";

export const messagesRouter = createTRPCRouter({
  create : baseProcedure
    .input(
        z.object({
            value : z.string().min(1,{message : "Message is required"}),
        }),
    )
    .mutation(async({input}) => {
        
    }),
});