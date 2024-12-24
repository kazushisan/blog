import footnote from 'markdown-it-footnote';
import { defineConfig, HeadConfig } from 'vitepress';
import { ogImagePlugin } from './ogImage';
import { editHistory } from './editHistory';

const repositoryUrl = 'https://github.com/kazushisan/gadgetlunatic';
const baseUrl = 'https://gadgetlunatic.com';

const ogImage = ogImagePlugin();

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
    plugins: [ogImage.vitePlugin],
  },
  scrollOffset: 24,
  cleanUrls: true,
  srcExclude: ['README.md'],
  transformHead(context) {
    const url = `${baseUrl}/${context.pageData.filePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, context.siteConfig.cleanUrls ? '' : '.html')}`;

    const result: HeadConfig[] = [
      [
        'meta',
        {
          property: 'og:title',
          content: context.title,
        },
      ],
      [
        'meta',
        {
          property: 'og:url',
          // todo: consider a better way to get the url
          // @see https://github.com/vuejs/vitepress/blob/3eb4374af286362d7f4257b288fd2d5b9173dcba/src/node/contentLoader.ts#L142
          content: url,
        },
      ],
      [
        'meta',
        {
          property: 'og:type',
          content: 'website',
        },
      ],
    ];

    const meta = ogImage.get(context);

    if (meta) {
      result.push(meta, [
        'meta',
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
      ]);
    }

    return result;
  },
});
