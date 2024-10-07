/*global console, Response*/
import { globSync } from 'glob';
import { build } from 'vite';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { PassThrough } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';

const __dirname = dirname(fileURLToPath(import.meta.url));

execSync(`rm -rf ${__dirname}/../dist`);

await build({
  build: {
    outDir: 'dist/static',
  },
});

await build({
  build: {
    outDir: 'dist/server',
    ssr: 'src/serverRenderer.tsx',
  },
});

console.log('Generating routes...');

const files = globSync('./content/**/*.{md,mdx}');

const routes = [
  ...files.map((file) =>
    file.replace(/^content(.+?)(\/index|)\.(md|mdx)$/, '$1'),
  ),
  '/',
];

const template = await readFile(
  resolve(__dirname, '../dist/static/index.html'),
  'utf-8',
);
const [header, footer] = template.split('<!--ssr-outlet-->');

const { render } = await import('../dist/server/serverRenderer.js');

const promises = routes.map(async (route) => {
  const passThrough = new PassThrough();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const context: any = {};

  const stream = renderToPipeableStream(render({ path: route, context }), {
    onShellReady() {
      passThrough.write(
        header.replace(
          '<!--helmet-->',
          [
            context.helmet.title.toString(),
            context.helmet.meta.toString(),
            context.helmet.link.toString(),
          ].join(''),
        ),
      );
      stream.pipe(passThrough);
      passThrough.end(footer);
    },
    onError(e) {
      throw e;
    },
  });

  // fixme
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const html = await new Response(passThrough as any).text();

  await mkdir(resolve(__dirname, '../dist/static', `./${route}`), {
    recursive: true,
  });

  await writeFile(
    resolve(__dirname, '../dist/static', `./${route}`, 'index.html'),
    html,
  );
});

await Promise.all(promises);

console.log(`Finished generating ${promises.length} routes!`);
