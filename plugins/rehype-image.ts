import { visit } from 'unist-util-visit';
import { join } from 'node:path';
import { Plugin } from 'unified';

const importDefault = (identifier: string, path: string) => ({
  type: 'mdxjsEsm',
  value: '',
  data: {
    estree: {
      type: 'Program',
      body: [
        {
          type: 'ImportDeclaration',
          specifiers: [
            {
              type: 'ImportDefaultSpecifier',

              local: {
                type: 'Identifier',
                name: identifier,
              },
            },
          ],
          source: {
            type: 'Literal',
            value: `${path}`,
            raw: `'${path}'`,
          },
        },
      ],
      sourceType: 'module',
    },
  },
});

const jsxImage = (identifier: string, alt: string) => ({
  type: 'mdxJsxFlowElement',
  name: 'img',
  attributes: [
    {
      type: 'mdxJsxAttribute',
      name: 'src',
      value: {
        type: 'mdxJsxAttributeValueExpression',
        value: identifier,
        data: {
          estree: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'Identifier',
                  name: identifier,
                },
              },
            ],
            sourceType: 'module',
            comments: [],
          },
        },
      },
    },
    {
      type: 'mdxJsxAttribute',
      name: 'alt',
      value: alt,
    },
  ],
  children: [],
});

const image: Plugin = () => {
  const imported: string[] = [];
  // fixme
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (ast: any) => {
    visit(
      ast,
      { type: 'element', tagName: 'img' },

      // fixme
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (node: any, index, parent) => {
        const { src, alt } = node.properties;

        if (typeof src !== 'string' || typeof alt !== 'string') {
          return;
        }

        const identifier = src.replaceAll(/([^a-zA-Z0-9])/g, '');
        const path = src.startsWith('..') ? src : `./${join(src)}`;

        if (!imported.includes(src)) {
          ast.children.unshift(importDefault(identifier, path));
        }
        parent.children.splice(index, 1, jsxImage(identifier, alt));
        imported.push(src);
      },
    );
  };
};

export default image;
