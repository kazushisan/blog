/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'node:path';
import fs from 'node:fs';
import { normalizePath } from 'vite';
import { createMarkdownRenderer, LoaderModule, SiteConfig } from 'vitepress';

type Post = {
  title: string;
  url: string;
  date: string;
  permalink?: string;
  modifiedDate?: string;
  hash?: string;
};

declare const data: { [locale: string]: Post[] };

export { data };

const cache = new Map<string, { data: Data; timestamp: number }>();

const config: SiteConfig = (global as any).VITEPRESS_CONFIG;

if (!config) {
  throw new Error();
}

type Data = {
  url: string;
  frontmatter: Record<string, any>;
};

export default {
  watch: '**/*.md',
  async load(files) {
    const md = await createMarkdownRenderer(
      config.srcDir,
      config.markdown,
      config.site.base,
      config.logger,
    );

    const raw: { [locale: string]: Data[] } = {};

    Object.keys(config.site.locales).forEach((locale) => {
      raw[locale] = [];
    });

    for (const file of files) {
      const timestamp = fs.statSync(file).mtimeMs;
      const cached = cache.get(file);
      const locale = file.split('/')[0];

      if (cached && timestamp === cached.timestamp && locale in raw) {
        raw[locale].push(cached.data);
        continue;
      }

      const src = fs.readFileSync(file, 'utf-8');

      // @see https://github.com/vuejs/vitepress/blob/3eb4374af286362d7f4257b288fd2d5b9173dcba/src/node/contentLoader.ts#L142
      const url = `/${normalizePath(path.relative(config.srcDir, file))
        .replace(/\/index\.md$/, '')
        .replace(/\.md$/, config.cleanUrls ? '' : '.html')}`;

      const env: Record<string, unknown> = { path: file };

      md.render(src, env);

      const data = {
        frontmatter: env.frontmatter!,
        url,
      };

      if ((env.frontmatter as any).home) {
        continue;
      }

      if (locale in raw) {
        cache.set(file, { data, timestamp });
        raw[locale].push(data);
      }
    }

    return Object.entries(raw).reduce(
      (acc, [locale, value]) => ({
        ...acc,
        [locale]: value
          .map(
            (data) =>
              ({
                title: data.frontmatter.title,
                url: data.url,
                date: data.frontmatter.date,
                permalink: data.frontmatter.permalink,
                modifiedDate: data.frontmatter.modifiedDate,
                hash: data.frontmatter.hash,
              }) satisfies Post,
          )
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          ),
      }),
      {} as { [local: string]: Post[] },
    );
  },
} satisfies LoaderModule;
