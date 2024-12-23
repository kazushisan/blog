import { defineConfig } from 'vitepress';
import footnote from 'markdown-it-footnote';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'gadgetlunatic',
  // description: ''
  markdown: {
    math: true,
    headers: true,
    config: (md) => {
      md.use(footnote);
    },
  },
  scrollOffset: 32,
});
