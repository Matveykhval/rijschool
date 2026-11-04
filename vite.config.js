import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Using './' ensures assets resolve properly both on a GitHub Pages project subpath
  // (e.g. https://username.github.io/rijschool/) and on a custom domain (e.g. https://klaverdrive.nl).
  // If using BrowserRouter on a project subpath, set base: '/rijschool/'.
  base: './',
});

