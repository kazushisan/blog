import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from './plugins/rollup-plugin-mdx';
import posts from './plugins/vite-plugin-posts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mdx(), posts()],
});
