import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import * as trpcExpress from '@trpc/server/adapters/express';
import express from "express";
import { appRouter } from "./_app-router";

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({});

type Context = inferAsyncReturnType<typeof createContext>;

const app = express();
app.use(
  '/api/trpc',
  trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
  }),
);

export default app;