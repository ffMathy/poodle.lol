import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import { vercelEdgeAdapter } from '@builder.io/qwik-city/adapters/vercel-edge/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ['src/frontend/entry.vercel-edge.tsx', '@qwik-city-plan'],
      },
      outDir: '.vercel/output/functions/_qwik-city.func',
    },
    ssr: {
      external: ["express"]
    },
    plugins: [
      qwikCity({ 
        routesDir: 'src/frontend/routes'
      }), 
      qwikVite({ 
        srcDir: 'src/frontend'
      }),
      vercelEdgeAdapter(),
      tsconfigPaths()
    ],
    preview: {
      headers: {
        'Cache-Control': 'public, max-age=600',
      },
    }
  };
});
