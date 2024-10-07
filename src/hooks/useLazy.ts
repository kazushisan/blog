import { PostListItem } from 'content:posts';
import { ProcessedPost } from 'content:routes';
import { createElement, ReactElement } from 'react';

let postList: PostListItem[] | null = null;

export const useLazyPostList = () => {
  if (postList) {
    return postList;
  }

  throw import('content:posts').then((imported) => {
    postList = imported.default;
  });
};

const loaded = new Map<
  string,
  Omit<ProcessedPost, 'default' | 'path'> & { element: ReactElement }
>();

export const useLazyPage = (
  path: string,
  load: () => Promise<ProcessedPost>,
) => {
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
      date: value.date,
      permalink: value.permalink,
      modifiedDate: value.modifiedDate,
      hash: value.hash,
      headings: value.headings,
      element: createElement(value.default),
    });
  });
};
