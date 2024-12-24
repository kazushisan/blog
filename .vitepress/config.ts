import footnote from 'markdown-it-footnote';
import { defineConfig } from 'vitepress';
import { Og } from './og';
import { editHistory } from './editHistory';

const repositoryUrl = 'https://github.com/kazushisan/gadgetlunatic';
const baseUrl = 'https://gadgetlunatic.com';

const og = new Og({ baseUrl });

export default defineConfig({
  title: 'gadgetlunatic',
  // description: ''
  markdown: {
    math: true,
    headers: true,
    config: (md) => {
      md.use(footnote);
      md.use(editHistory, { repositoryUrl });
    },
    theme: 'nord',
  },
  vite: {
    plugins: [og.vitePlugin()],
  },
  scrollOffset: 24,
  cleanUrls: true,
  srcExclude: ['README.md'],
  transformHead(context) {
    return og.tags(context);
  },
});
