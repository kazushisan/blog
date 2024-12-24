/* eslint-disable @typescript-eslint/no-explicit-any */
import footnote from 'markdown-it-footnote';
import type { PluginSimple } from 'markdown-it';
import { execSync } from 'node:child_process';
import { basename, join, relative } from 'node:path';
import { cwd } from 'node:process';
import {
  createMarkdownRenderer,
  defineConfig,
  HeadConfig,
  SiteConfig,
} from 'vitepress';
import { ImageResponse } from '@vercel/og';
import { Plugin } from 'vite';

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

const ogImage = async ({ title }: { title: string; date: string }) => {
  const response = new ImageResponse(
    {
      type: 'div',
      props: {
        style: {
          fontSize: 40,
          color: 'black',
          background: 'white',
          width: '100%',
          height: '100%',
          padding: '50px 200px',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          a: 'hello',
        },
        children: `${title}`,
      },
    },
    {
      width: 1200,
      height: 630,
    },
  );

  return Buffer.from(await response.arrayBuffer());
};

const generatedImage = new Map<string, { referenceId: string; url?: string }>();

const baseUrl = 'https://gadgetlunatic.com';

const og = (): Plugin => ({
  name: 'og',
  apply: 'build',
  async transform(code, id) {
    if (!id.endsWith('.md')) {
      return null;
    }

    const config: SiteConfig = (global as any).VITEPRESS_CONFIG;
    const md = await createMarkdownRenderer(
      config.srcDir,
      config.markdown,
      config.site.base,
      config.logger,
    );

    const env: Record<string, any> = {};

    md.render(code, env);

    const frontmatter = env.frontmatter as Record<string, any>;

    const source = await ogImage({
      title: frontmatter.title,
      date: frontmatter.date,
    });

    const referenceId = this.emitFile({
      type: 'asset',
      name: `${basename(id, '.md')}.png`,
      source,
    });

    generatedImage.set(id, { referenceId });

    return null;
  },
  generateBundle() {
    for (const [id, { referenceId }] of generatedImage) {
      generatedImage.set(id, {
        referenceId,
        url: this.getFileName(referenceId),
      });
    }
  },
  enforce: 'pre',
});

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
    plugins: [og()],
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

    const key = join(context.siteConfig.srcDir, context.pageData.filePath);
    const value = generatedImage.get(key);

    if (value?.url) {
      result.push(
        [
          'meta',
          {
            property: 'og:image',
            content: join('/', value.url),
          },
        ],
        [
          'meta',
          {
            name: 'twitter:card',
            content: 'summary_large_image',
          },
        ],
      );
    }
    return result;
  },
});
