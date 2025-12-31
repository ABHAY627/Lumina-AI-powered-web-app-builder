import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { inngest } from '@/inngest/client';
import { messagesRouter } from '@/modules/messages/server/proceedure';
import { projectsRouter } from '@/modules/projects/server/proceedure';

// Define shared input schema for the `invoke` procedure
// const invokeInput = z.object({
//   value: z.string(),
// });

export const appRouter = createTRPCRouter({

  // ek tarah se api backend likha hua hai yahan par 

  messages : messagesRouter,
  projects : projectsRouter,
    
  
  // createAI: baseProcedure
  //   .input(
  //     z.object({
  //       text: z.string(),
  //     }),
  //   )
  //   .query((opts) => {
  //     return {
  //       greeting: `hello ${opts.input.text}`,
  //     };
  //   }),
});
// export type definition of API
export type AppRouter = typeof appRouter;