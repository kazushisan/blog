import footnote from 'markdown-it-footnote';
import type { PluginSimple } from 'markdown-it';
import { execSync } from 'node:child_process';
import { basename, relative } from 'node:path';
import { cwd } from 'node:process';
import { defineConfig } from 'vitepress';
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

const generatedOgImage = new Map<string, string>();

const og = (): Plugin => ({
  name: 'og',
  apply: 'build',
  async transform(_, id) {
    if (!id.endsWith('.md')) {
      return null;
    }

    const frontmatter = {
      title: 'テスト',
      date: '2024-12-24',
    };

    const source = await ogImage({
      title: frontmatter.title,
      date: frontmatter.date,
    });

    const name = this.emitFile({
      type: 'asset',
      name: `${basename(id, '.md')}.png`,
      source,
    });

    generatedOgImage.set(id, name);

    return null;
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
});
