import { defineConfig, loadEnv } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => {
  Object.assign(process.env, loadEnv('', process.cwd()));
  return {
    plugins: [qwikCity(), qwikVite(), tsconfigPaths()],
    preview: {
      headers: {
        'Cache-Control': 'public, max-age=600',
      },
      hmr: {
          clientPort: Number(process.env.VITE_PORT)
      },
      port: Number(process.env.VITE_PORT),
      strictPort: true,
      host: "0.0.0.0"
    },
    server: {
      hmr: {
          clientPort: Number(process.env.VITE_PORT)
      },
      port: Number(process.env.VITE_PORT),
      strictPort: true,
      host: "0.0.0.0"
    }
  };
});
