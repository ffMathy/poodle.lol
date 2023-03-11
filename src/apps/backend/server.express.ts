import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import type { AppRouter } from './server';
import express from "express";

/**
 * Used when debugging locally.
 */
export default function configureExpress(appRouter: AppRouter) {
    const createContext = ({
        req,
        res,
    }: trpcExpress.CreateExpressContextOptions) => ({});

    type Context = inferAsyncReturnType<typeof createContext>;
    const t = initTRPC.context<Context>().create();
    const app = express();
    app.use(
        '/trpc',
        trpcExpress.createExpressMiddleware({
            router: appRouter,
            createContext,
        }),
    );

    const port = 3000;
    app.listen(port);
    console.info(`Listening on port ${port}`);
}