import type { PluginSimple } from 'markdown-it';
import footnote from 'markdown-it-footnote';
import { execSync } from 'node:child_process';
import { relative } from 'node:path';
import { cwd } from 'node:process';
import { defineConfig, HeadConfig } from 'vitepress';
import { ogImagePlugin } from './og-image-plugin';

const REPO_URL = 'https://github.com/kazushisan/gadgetlunatic';

const editHistory: PluginSimple = (md) => {
  const render = md.render.bind(md);

  md.render = (src, env) => {
    const { path } = env;

    if (typeof path !== 'string') {
      return render(src, env);
    }

    const history = execSync(
      `git log --follow --pretty=format:"%H %cd %s" --date=iso-strict -- ${path}`,
    )
      .toString()
      .split('\n');

    const lastModified = history.find(
      (line) => !line.includes('[skip modified]'),
    );

    const hash = lastModified ? lastModified.split(' ')[0] : undefined;

    const permalink = hash
      ? `${REPO_URL}/blob/${hash}/${relative(cwd(), path)}`
      : undefined;

    const modifiedDate = lastModified ? lastModified.split(' ')[1] : undefined;

    env.frontmatter = {
      ...env.frontmatter,
      hash,
      permalink,
      modifiedDate,
    };

    return render(src, env);
  };
};

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
      md.use(editHistory);
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
