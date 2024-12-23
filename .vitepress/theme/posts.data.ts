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
        date: formatDate(frontmatter.date),
      }))
      .sort((a, b) => b.date.timestamp - a.date.timestamp);
  },
});

declare const data: Post[];

export { data };

const formatDate = (raw: string) => {
  const date = new Date(raw);

  return {
    timestamp: date.getTime(),
    string: date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  };
};
