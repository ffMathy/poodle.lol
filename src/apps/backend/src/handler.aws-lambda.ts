import { inferAsyncReturnType } from '@trpc/server';
import { CreateAWSLambdaContextOptions, awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import type { AppRouter } from './app-router';

export default function configureAws(appRouter: AppRouter) {
    const createContext = ({
        event,
        context,
    }: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>) => ({})

    type Context = inferAsyncReturnType<typeof createContext>;
    const handler = awsLambdaRequestHandler({
        router: appRouter,
        createContext,
    });
    return handler;
}