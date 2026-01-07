import { initTRPC ,TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { cache } from 'react';
import {auth} from '@clerk/nextjs/server'
export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return {auth: await auth()};
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
export type context = Awaited<ReturnType<typeof createTRPCContext>>
const t = initTRPC.context<context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authenticated",
    });
  }

  return next({
    ctx: {
      auth: ctx.auth,
    },
  });
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

// now we created a protected proceedure .
// so that there exists only api calling when the user is authenticated 
// from now on we will be replacing our baseProcedure with protectedProcedure
export const protectedProcedure = t.procedure.use(isAuthed);