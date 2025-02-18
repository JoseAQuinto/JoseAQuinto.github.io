import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/", // Para repositorio "JoseAQuinto.github.io", debe ser "/"
  build: {
    outDir: "dist",
  }
});
