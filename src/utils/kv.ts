import { createClient } from "@vercel/kv";

export function createQwikCompatibleKvClient() {
    //this is needed due to: https://github.com/vercel/storage/issues/168
    return createClient({
        url: process.env['KV_REST_API_URL']!,
        token: process.env['KV_REST_API_TOKEN']!,
      });
}