import { defineConfig } from 'vitepress';
import footnote from 'markdown-it-footnote';
import type { PluginSimple } from 'markdown-it';
import { execSync } from 'node:child_process';
import { relative } from 'node:path';
import { cwd } from 'node:process';

// https://vitepress.dev/reference/site-config
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
  },
  scrollOffset: 32,
  cleanUrls: true,
});

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
