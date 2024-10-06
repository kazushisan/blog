import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'node:stream';
import { PluginOption } from 'vite';

const executeCode = (code: string) =>
  import(`data:text/javascript,${encodeURIComponent(code)}`);

function sitemap() {
  return {
    name: 'sitemap',
    apply: (_, env) => !env.isSsrBuild && env.command === 'build',
    async buildStart() {
      const stream = new SitemapStream({
        hostname: 'https://gadgetlunatic.com',
      });

      stream.write({ url: '' });

      await Promise.all(
        ['content:postList', 'content:latexList'].map(async (target) => {
          const resolution = await this.resolve(target);

          if (!resolution) {
            throw new Error(`failed to resolve ${target}`);
          }

          const loaded = await this.load(resolution);

          const data = (await executeCode(loaded.code || '')).default;

          const list = data.map(
            (item: { path: string; date: string; modifiedDate?: string }) => ({
              url: item.path,
              lastmod: item.modifiedDate || item.date,
            }),
          );

          const readable = Readable.from(list);

          readable.pipe(stream, { end: false });

          return new Promise((resolve) => {
            readable.on('end', resolve);
          });
        }),
      );

      stream.end();

      const source = (await streamToPromise(stream)).toString();

      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source,
      });
    },
  } satisfies PluginOption;
}

export default sitemap;
