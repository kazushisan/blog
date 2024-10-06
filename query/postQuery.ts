import { extract } from './extract.js';

const getTime = (date: string) => (new Date(date).getTime() / 1000) | 0;

const query = (
  list: {
    path: string;
    date: string;
    data: {
      title?: string;
      date?: string;
      permalink: string;
      modifiedDate: string;
      hash: string;
      weight?: number;
    };
  }[],
) =>
  list
    .map(extract)
    .filter((item) => item.path.startsWith('/post'))
    .sort((a, b) => (getTime(b.date) - getTime(a.date)) | 0);

export default query;
