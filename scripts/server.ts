/*global console*/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { renderToPipeableStream } from 'react-dom/server';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const template = fs.readFileSync(
  path.resolve(__dirname, '../index.html'),
  'utf-8',
);

async function createServer() {
  const app = express();
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  app.use(vite.middlewares);

  app.use('*', async (req, res, next) => {
    const { originalUrl } = req;

    try {
      const transformed = await vite.transformIndexHtml(originalUrl, template);

      const [header, footer] = transformed.split('<!--ssr-outlet-->');

      const { render } = await vite.ssrLoadModule('src/ssr.tsx');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const context: any = {};

      const stream = renderToPipeableStream(
        render({ path: originalUrl, context }),
        {
          onShellReady() {
            res.status(200).set({ 'Content-Type': 'text/html' });
            res.write(
              header.replace(
                '<!--helmet-->',
                [
                  context.helmet.title.toString(),
                  context.helmet.meta.toString(),
                  context.helmet.link.toString(),
                ].join(''),
              ),
            );
            stream.pipe(res);
            res.end(footer);
          },
          onError(e) {
            throw e;
          },
        },
      );
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  app.listen(5173, () => {
    console.log('listening on port 5173');
  });
}

createServer();
