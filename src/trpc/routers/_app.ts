import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { inngest } from '@/inngest/client';
// Define shared input schema for the `invoke` procedure
const invokeInput = z.object({
  value: z.string(),
});
export const appRouter = createTRPCRouter({

  // ek tarah se api backend likha hua hai yahan par 

  invoke: baseProcedure
    .input(invokeInput)
    .mutation(async ({ input }: { input: z.infer<typeof invokeInput> }) => {
      await inngest.send({
        name: "test/hello.world",
        data: { value: input.value },
      });
      return { success: true };
    }),
    
  
  createAI: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;