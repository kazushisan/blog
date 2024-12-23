import { createContentLoader } from 'vitepress';

type Post = {
  title: string;
  url: string;
  date: {
    timestamp: number;
    string: string;
  };
};

export default createContentLoader('post/*.md', {
  transform(raw) {
    return raw
      .map(({ url, frontmatter }) => ({
        title: frontmatter.title,
        url,
        date: frontmatter.date,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
});

declare const data: Post[];

export { data };
