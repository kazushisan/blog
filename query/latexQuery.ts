import { extract } from './extract.js';

const query = (
  list: {
    path: string;
    weight?: number;
    title: string;
    date: string;
    modifiedDate: string;
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
    .filter((item) => item.path.startsWith('/latex'))
    .sort((a, b) => (a.weight - b.weight) | 0)
    .map((param) => ({
      title: param.title,
      path: param.path,
      date: param.date,
      modifiedDate: param.modifiedDate,
    }));

export default query;
