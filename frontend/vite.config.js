import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

function resolveProxyTarget(rawTarget) {
  if (!rawTarget) {
    return 'http://localhost:5000';
  }

  try {
    const parsed = new URL(rawTarget);
    return parsed.origin;
  } catch (error) {
    return rawTarget;
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const target = resolveProxyTarget(env.VITE_API_BASE || 'http://localhost:5000');

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  };
});
