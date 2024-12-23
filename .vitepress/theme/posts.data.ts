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

declare const data: Post[];

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
  watch: 'post/*.md',
  async load(files) {
    const md = await createMarkdownRenderer(
      config.srcDir,
      config.markdown,
      config.site.base,
      config.logger,
    );

    const raw: Data[] = [];

    for (const file of files) {
      const timestamp = fs.statSync(file).mtimeMs;
      const cached = cache.get(file);

      if (cached && timestamp === cached.timestamp) {
        raw.push(cached.data);
        continue;
      }

      const src = fs.readFileSync(file, 'utf-8');

      // @see https://github.com/vuejs/vitepress/blob/3eb4374af286362d7f4257b288fd2d5b9173dcba/src/node/contentLoader.ts#L142
      const url = `/${normalizePath(path.relative(config.srcDir, file))
        .replace(/(^|\/)index\.md$/, '$1')
        .replace(/\.md$/, config.cleanUrls ? '' : '.html')}`;

      const env: Record<string, unknown> = { path: file };

      md.render(src, env);

      const data = {
        frontmatter: env.frontmatter!,
        url,
      };

      cache.set(file, { data, timestamp });
      raw.push(data);
    }

    return raw.map(
      (data) =>
        ({
          title: data.frontmatter.title,
          url: data.url,
          date: data.frontmatter.date,
          permalink: data.frontmatter.permalink,
          modifiedDate: data.frontmatter.modifiedDate,
          hash: data.frontmatter.hash,
        }) satisfies Post,
    );
  },
} satisfies LoaderModule;
