import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ['src/backend/index.ts'],
        output: {
          esModule: true
        }
      },
      outDir: 'dist/backend',
    },
    ssr: {
      external: ["express"]
    },
    preview: {
      headers: {
        'Cache-Control': 'public, max-age=600',
      },
    }
  };
});
