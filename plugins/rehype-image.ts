import { visit } from 'unist-util-visit';
import { join } from 'node:path';
import { Transformer } from 'unified';
import { Element } from 'hast';
import { MdxjsEsm } from 'mdast-util-mdxjs-esm';
import { MdxJsxFlowElement } from 'mdast-util-mdx-jsx';

const importDefault = (identifier: string, path: string) =>
  ({
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
  }) satisfies MdxjsEsm;

const jsxImage = (identifier: string, alt: string) =>
  ({
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
  }) satisfies MdxJsxFlowElement;

const image = () => {
  const imported: string[] = [];
  const transformer: Transformer<MdxjsEsm | MdxJsxFlowElement | Element> = (
    ast,
  ) => {
    visit(ast, { type: 'element', tagName: 'img' }, (node, index, parent) => {
      const { properties } = node;

      if (!properties || !parent || typeof index !== 'number') {
        return;
      }

      const { src, alt } = properties;

      if (typeof src !== 'string' || typeof alt !== 'string') {
        return;
      }

      const identifier = src.replaceAll(/([^a-zA-Z0-9])/g, '');
      const path = src.startsWith('..') ? src : `./${join(src)}`;

      if (!imported.includes(src) && 'children' in ast) {
        (ast.children as ((typeof ast.children)[number] | MdxjsEsm)[]).unshift(
          importDefault(identifier, path),
        );
      }
      parent.children.splice(index, 1, jsxImage(identifier, alt));
      imported.push(src);
    });
  };

  return transformer;
};

export default image;
