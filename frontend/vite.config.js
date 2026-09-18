import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// O backend FastAPI nao registra CORSMiddleware, entao chamadas diretas de
// localhost:5173 para localhost:8000 morreriam no preflight. O proxy abaixo faz
// o browser enxergar tudo na mesma origem: o frontend chama /api/... relativo e
// o dev server encaminha para o backend.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendUrl = env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:8000'

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
        },
      },
    },
  }
})
