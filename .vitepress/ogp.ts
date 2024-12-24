/* eslint-disable @typescript-eslint/no-explicit-any */
import { ImageResponse } from '@vercel/og';
import { type Plugin } from 'vite';
import {
  createMarkdownRenderer,
  HeadConfig,
  TransformContext,
  type SiteConfig,
} from 'vitepress';
import { basename, join } from 'node:path';

const image = async ({ title }: { title: string; date: string }) => {
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

        if (frontmatter.home) {
          return null;
        }

        const source = await image({
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
    };
  }

  tags(context: TransformContext) {
    const key = join(context.siteConfig.srcDir, context.pageData.filePath);
    const value = this.generatedImage.get(key);

    // todo: consider a better way to get the url
    // @see https://github.com/vuejs/vitepress/blob/3eb4374af286362d7f4257b288fd2d5b9173dcba/src/node/contentLoader.ts#L142
    const path = `${context.pageData.filePath.replace(/\/index\.md$/, '').replace(/\.md$/, context.siteConfig.cleanUrls ? '' : '.html')}`;

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
            content: join(context.siteData.base || '/', value.url),
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
