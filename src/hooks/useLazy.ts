import { createElement } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let postList: any[] | null = null;

export const useLazyPostList = () => {
  if (postList) {
    return postList;
  }

  throw import('content:postList').then((imported) => {
    postList = imported.default;
  });
};

// fixme
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let latexList: any[] | null = null;

export const useLazyLatexList = () => {
  if (latexList) {
    return latexList;
  }

  throw import('content:latexList').then((imported) => {
    latexList = imported.default;
  });
};

const loaded = new Map();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useLazyPage = (path: string, load: () => Promise<any>) => {
  const page = loaded.get(path);

  if (page) {
    return page;
  }

  throw load().then((value) => {
    if (typeof value.title === 'undefined') {
      throw new Error(`title not found for ${path}`);
    }
    if (typeof value.date === 'undefined') {
      throw new Error(`date not found for ${path}`);
    }
    loaded.set(path, {
      title: value.title,
      draft: value.draft,
      date: value.date,
      permalink: value.permalink,
      modifiedDate: value.modifiedDate,
      hash: value.hash,
      weight: value.weight || 0,
      headings: value.headings,
      element: createElement(value.default),
    });
  });
};
