import type { PluginWithOptions } from 'markdown-it';
import { execSync } from 'node:child_process';
import { relative } from 'node:path';
import { cwd } from 'node:process';

export const editHistory: PluginWithOptions<{ repositoryUrl: string }> = (
  md,
  options,
) => {
  if (typeof options?.repositoryUrl !== 'string') {
    throw new Error('repositoryUrl is required');
  }

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
      ? `${options?.repositoryUrl}/blob/${hash}/${relative(cwd(), path)}`
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
