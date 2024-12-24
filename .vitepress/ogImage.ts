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

export const ogImagePlugin = () => {
  const generatedImage = new Map<
    string,
    { referenceId: string; url?: string }
  >();

  const vitePlugin: Plugin = {
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

  return {
    vitePlugin,
    get(context: TransformContext) {
      const key = join(context.siteConfig.srcDir, context.pageData.filePath);
      const value = generatedImage.get(key);

      return value && value.url
        ? ([
            'meta',
            {
              property: 'og:image',
              content: join(context.siteData.base || '/', value.url),
            },
          ] satisfies HeadConfig)
        : undefined;
    },
  };
};
