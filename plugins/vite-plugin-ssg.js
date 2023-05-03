import { globSync } from 'glob';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import stringifyObject from 'stringify-object';

const virtualModulePrefix = 'ssg:';
const internalPrefix = 'ssg-internal:';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '../');

/**
 * @this {import('rollup').PluginContext}
 * @param {string} file
 */
async function extractFromFile(file) {
  const resolution = await this.resolve(file, undefined, {
    skipSelf: true,
  });

  if (!resolution) {
    throw new Error(`failed to resolve file: ${file}`);
  }

  const loaded = await this.load(resolution);

  // node.js will throw an error when it tries to execute import statements in data uri code
  // because it will fail to resolve the module.
  // for now, removing the import statement will avoid throwing errors.
  const modified = loaded.code.replaceAll(/^(import\s.+;)$/gm, '');

  const executed = await import(
    `data:text/javascript,${encodeURIComponent(modified)}`
  );

  return {
    data: executed,
    path: file.replace(/^content(.+?)(\/index|)\.(md|mdx)$/, '$1'),
  };
}

/**
 * @param {{ [list: string]: string }} config
 * @returns {import('vite').PluginOption}
 */
function virtual(config) {
  let serve = false;

  return {
    name: 'virtual',
    config(_, env) {
      serve = env.command === 'serve';
    },
    resolveId(source) {
      if (source === `${virtualModulePrefix}routes`) {
        return source;
      }

      if (source.startsWith(virtualModulePrefix)) {
        const target = source.slice(virtualModulePrefix.length);

        if (!Object.keys(config).includes(target)) {
          return null;
        }

        return source;
      }

      if (source.startsWith(internalPrefix)) {
        const target = source.slice(internalPrefix.length);

        if (!Object.keys(config).includes(target)) {
          return null;
        }

        return resolve(projectRoot, config[target]);
      }

      return null;
    },
    async load(id) {
      if (!id.startsWith(virtualModulePrefix)) {
        return null;
      }

      const target = id.slice(virtualModulePrefix.length);
      const files = globSync('./content/**/*.{md,mdx}');

      // use the same logic for serve and build
      if (target === 'routes') {
        const routes = files.map((file) => ({
          path: file.replace(/^content(.+?)(\/index|)\.(md|mdx)$/, '$1'),
          file: `../../${file}`,
        }));

        return `export default ${stringifyObject(routes)}`;
      }

      if (!Object.keys(config).includes(target)) {
        return null;
      }

      if (serve) {
        return `
        import transformer from '${internalPrefix}${target}';
        const files = import.meta.glob('/content/**/*.{md,mdx}', { eager: true });
        const list = Object.entries(files).map(([path, data]) => ({
          path: path.replace(/^\\/content(.+?)(\\/index|)\\.(md|mdx)$/, '$1'),
          data,
        }));
        const result = transformer(list);
        export default result;
        `;
      }

      const list = await Promise.all(
        files.map((file) => extractFromFile.call(this, file)),
      );

      const { default: transformer } = await import(
        resolve(projectRoot, config[target])
      );
      const result = transformer(list);

      return `export default ${stringifyObject(result)}`;
    },
  };
}

export default virtual;