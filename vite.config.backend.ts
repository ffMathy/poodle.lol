import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ['src/api/index.ts'],
        output: {
          esModule: true
        }
      },
      sourcemap: true,
      outDir: './output/api',
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
