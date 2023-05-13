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
        input: ['src/static/entry.vercel-edge.tsx', '@qwik-city-plan'],
      },
      sourcemap: true,
      outDir: './.vercel/output/static',
    },
    ssr: {
      external: ["express"]
    },
    plugins: [
      qwikCity({ 
        routesDir: 'src/static/routes'
      }), 
      qwikVite({ 
        srcDir: 'src/static'
      }),
      // vercelEdgeAdapter({
      //   staticPaths: ["src/static/public"],
      //   outputConfig: false
      // }),
      tsconfigPaths()
    ],
    preview: {
      headers: {
        'Cache-Control': 'public, max-age=600',
      },
    }
  };
});
