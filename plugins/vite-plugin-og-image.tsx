import React from 'react';
import { ImageResponse } from '@vercel/og';
import { PluginOption } from 'vite';
import { globSync } from 'glob';
import type { PluginContext } from 'rollup';
import { basename } from 'node:path';

async function generateOgImage(this: PluginContext, file: string) {
  const resolved = await this.resolve(file, undefined, { skipSelf: true });

  if (!resolved) {
    throw new Error(`Failed to resolve ${file}`);
  }

  const loaded = await this.load(resolved);

  // node.js will throw an error when it tries to execute import statements in data uri code
  // because it will fail to resolve the module.
  // for now, removing the import statement will avoid throwing errors.
  const modified = loaded.code?.replaceAll(/^(import\s.+;)$/gm, '') || '';

  const executed = await import(
    `data:text/javascript,${encodeURIComponent(modified)}`
  );

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          color: 'black',
          background: 'white',
          width: '100%',
          height: '100%',
          padding: '50px 200px',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {executed.title}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}

function ogImage() {
  return {
    name: 'og',
    apply: 'build',
    async buildEnd() {
      const files = globSync('./content/**/*.{md,mdx}');

      for (const file of files) {
        const image = await generateOgImage.call(this, file);

        this.emitFile({
          type: 'asset',
          name: `og/${basename(
            file.replace(/^content(.+?)(\/index|)\.(md|mdx)$/, '$1.png'),
          )}`,
          source: Buffer.from(await image.arrayBuffer()),
        });
      }
    },
  } satisfies PluginOption;
}

export default ogImage;
