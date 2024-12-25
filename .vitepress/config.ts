import footnote from 'markdown-it-footnote';
import { defineConfig, VitePressData } from 'vitepress';
import { Ogp } from './ogp';
import { editHistory } from './editHistory';

const repositoryUrl = 'https://github.com/kazushisan/gadgetlunatic';
const baseUrl = 'https://gadgetlunatic.com';

const ogp = new Ogp({ baseUrl });

declare module 'vitepress' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace DefaultTheme {
    interface Config {
      repositoryUrl: string;
      baseUrl: string;
      x: string;
    }
  }

  function useData<T = DefaultTheme.Config>(): VitePressData<T>;
}

export default defineConfig({
  title: 'gadgetlunatic',
  description: 'Personal blog of Kazushi Konosu',
  themeConfig: {
    repositoryUrl,
    baseUrl,
    x: 'kazushikonosu',
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
