import footnote from 'markdown-it-footnote';
import { defineConfig } from 'vitepress';
import { Ogp } from './ogp';
import { editHistory } from './editHistory';

const repositoryUrl = 'https://github.com/kazushisan/gadgetlunatic';
const baseUrl = 'https://gadgetlunatic.com';

const ogp = new Ogp({ baseUrl });

export default defineConfig({
  title: 'gadgetlunatic',
  description: 'Personal blog of Kazushi Konosu',
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
    plugins: [ogp.vitePlugin()],
  },
  scrollOffset: 24,
  cleanUrls: true,
  srcExclude: ['README.md'],
  transformHead(context) {
    return ogp.tags(context);
  },
  locales: {
    ja: {
      label: '日本語',
      lang: 'ja-JP',
    },
    en: {
      label: 'English',
      lang: 'en-US',
    },
  },
});
