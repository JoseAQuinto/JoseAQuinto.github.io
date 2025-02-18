import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/JoseAQuinto.github.io/", // Cambia esto al nombre de tu repo en GitHub
});
