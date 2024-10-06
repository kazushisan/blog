import { createElement } from 'react';
let postList = null;
export const useLazyPostList = () => {
  if (postList) {
    return postList;
  }
  throw import('content:postList').then(imported => {
    postList = imported.default;
  });
};
let latexList = null;
export const useLazyLatexList = () => {
  if (latexList) {
    return latexList;
  }
  throw import('content:latexList').then(imported => {
    latexList = imported.default;
  });
};
const loaded = new Map();
export const useLazyPage = (path, load) => {
  const page = loaded.get(path);
  if (page) {
    return page;
  }
  throw load().then(value => {
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
      element: createElement(value.default)
    });
  });
};