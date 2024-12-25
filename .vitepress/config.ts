import footnote from 'markdown-it-footnote';
import { defineConfig, VitePressData } from 'vitepress';
import { Ogp } from './ogp';
import { editHistory } from './editHistory';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const repositoryUrl = 'https://github.com/kazushisan/blog';
const baseUrl = 'https://kazushikonosu.io';

const ogp = new Ogp({ baseUrl });

declare module 'vitepress' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace DefaultTheme {
    interface Config {
      repositoryUrl: string;
      baseUrl: string;
      x: string;
      author: string;
      avatar: string;
    }
  }

  function useData<T = DefaultTheme.Config>(): VitePressData<T>;
}

const avatar = (
  await readFile(resolve(dirname(fileURLToPath(import.meta.url)), 'avatar.jpg'))
).toString('base64');

export default defineConfig({
  title: 'kazushikonosu.io',
  description: 'Personal blog of Kazushi Konosu',
  themeConfig: {
    repositoryUrl,
    baseUrl,
    x: 'kazushikonosu',
    author: 'Kazushi Konosu',
    avatar: `data:image/jpeg;base64,${avatar}`,
  },
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
  lang: 'ja-JP',
  transformPageData(pageData, context) {
    let path = `${pageData.relativePath}`
      .replace(/\/index\.md$/, '')
      .replace(/\.md$/, context.siteConfig.cleanUrls ? '' : '.html');

    if (path === 'ja') {
      // special case: the ja index page should point to root
      path = '';
    }

    const href = `${baseUrl}${path ? `/${path}` : ''}`;

    pageData.frontmatter.head ??= [];
    pageData.frontmatter.head.push(['link', { rel: 'canonical', href }]);
  },
  sitemap: {
    hostname: baseUrl,
    transformItems(items) {
      return items.map((item) => ({
        ...item,
        url: item.url.replace(/\/$/, ''),
        links: item.links?.map((link) => ({
          ...link,
          url: link.url.replace(/\/$/, ''),
        })),
      }));
    },
  },
});
