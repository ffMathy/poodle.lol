import { appRouter } from './src/app-router';
export type { AppRouter } from './src/app-router';

import configureAws from './src/handler.aws-lambda';
import configureExpress from './src/handler.express';

export const handler = configureAws(appRouter);

const isRunningFromAws = "AWS_LAMBDA_FUNCTION_NAME" in process.env;
if(!isRunningFromAws) {
    //if we are not running from AWS, we need to host an express instance locally.
  configureExpress(appRouter);
}