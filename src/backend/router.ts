import { initTRPC } from '@trpc/server';
 
const t = initTRPC.create();
 
const router = t.router;
const publicProcedure = t.procedure;
 
const appRouter = router({});
 
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;