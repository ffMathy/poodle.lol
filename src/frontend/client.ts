// @filename: client.ts
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../backend/_app-router';
import superjson from 'superjson';
import { createTRPCNext } from '@trpc/next';

function getBaseUrl() {
  if (typeof window !== 'undefined')
    // browser should use relative path
    return '';
  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}/api`;
  if (process.env.RENDER_INTERNAL_HOSTNAME)
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}/api`;
  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}/api`;
}
 
//@ts-ignore
export const trpc = createTRPCNext<AppRouter>({
  config: () => {
    return {
      transformer: superjson,
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          async headers() {
            return {
            };
          },
        }),
      ],
    };
  },
  ssr: false
});