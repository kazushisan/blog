/* eslint-disable @typescript-eslint/no-explicit-any */
import { ImageResponse } from '@vercel/og';
import { type Plugin } from 'vite';
import {
  createMarkdownRenderer,
  DefaultTheme,
  HeadConfig,
  TransformContext,
  type SiteConfig,
} from 'vitepress';
import { basename, join } from 'node:path';

const cache = new Map<string, ArrayBuffer>();

const font = async (query: string) => {
  if (cache.has(query)) {
    return cache.get(query)!;
  }

  const googleFontUrl = `https://fonts.googleapis.com/css2?family=${query}`;

  const css = await fetch(googleFontUrl).then((res) => res.text());

  const url = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/,
  )?.[1];

  if (!url) {
    throw new Error('could not extract url');
  }

  const arrayBuffer = await fetch(url).then((res) => res.arrayBuffer());

  cache.set(query, arrayBuffer);
  return arrayBuffer;
};

const image = async ({
  title,
  date: raw,
  avatar,
  author,
}: {
  title: string;
  date: string;
  author: string;
  avatar: string;
}) => {
  const date = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
  }).format(new Date(raw));

  const response = new ImageResponse(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          padding: '48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#fff',
          fontFamily: 'Noto Sans JP',
        },
        children: [
          {
            type: 'div',
            props: {
              children: title,
              style: {
                fontSize: '64px',
                fontWeight: 700,
              },
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: '40px',
                display: 'flex',
                gap: '20px',
                alignItems: 'center',
                width: '100%',
              },
              children: [
                {
                  type: 'img',
                  props: {
                    src: avatar,
                    width: 60,
                    height: 60,
                    style: {
                      borderRadius: '50%',
                    },
                  },
                },
                {
                  type: 'div',
                  props: {
                    children: author,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      color: '#64748b',
                    },
                    children: date,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Noto Sans JP',
          data: await font('Noto+Sans+JP:wght@700'),
          weight: 700,
        },
        {
          name: 'Noto Sans JP',
          data: await font('Noto+Sans+JP:wght@400'),
          weight: 400,
        },
      ],
    },
  );

  return Buffer.from(await response.arrayBuffer());
};

export class Ogp {
  generatedImage = new Map<string, { referenceId: string; url?: string }>();
  baseUrl: string;

  constructor({ baseUrl }: { baseUrl: string }) {
    this.baseUrl = baseUrl;
  }

  vitePlugin(): Plugin {
    const { generatedImage } = this;

    return {
      name: 'og',
      apply: 'build',
      async transform(code, id) {
        if (!id.endsWith('.md')) {
          return null;
        }

        const config: SiteConfig<DefaultTheme.Config> = (global as any)
          .VITEPRESS_CONFIG;
        const md = await createMarkdownRenderer(
          config.srcDir,
          config.markdown,
          config.site.base,
          config.logger,
        );

        const env: Record<string, any> = {};

        md.render(code, env);

        const frontmatter = env.frontmatter as Record<string, any>;

        if (frontmatter.home) {
          return null;
        }

        const source = await image({
          title: frontmatter.title,
          date: frontmatter.date,
          author: config.site.themeConfig.author,
          avatar: config.site.themeConfig.avatar,
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
    };
  }

  tags(context: TransformContext) {
    const key = join(context.siteConfig.srcDir, context.pageData.filePath);
    const value = this.generatedImage.get(key);

    // todo: consider a better way to get the url
    // @see https://github.com/vuejs/vitepress/blob/3eb4374af286362d7f4257b288fd2d5b9173dcba/src/node/contentLoader.ts#L142
    const path = `${context.pageData.filePath.replace(/\/?index\.md$/, '').replace(/\.md$/, context.siteConfig.cleanUrls ? '' : '.html')}`;

    const url = `${this.baseUrl}${path ? `/${path}` : ''}`;

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

    if (value && value.url) {
      result.push(
        [
          'meta',
          {
            property: 'og:image',
            content: `${this.baseUrl}/${value.url}`,
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
  }
}
