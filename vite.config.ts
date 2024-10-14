import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from './plugins/rollup-plugin-mdx.js';
import content from './plugins/vite-plugin-content.js';
import sitemap from './plugins/vite-plugin-sitemap.js';
import ogImage from './plugins/vite-plugin-og-image.js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mdx(), content(), sitemap(), ogImage()],
});
