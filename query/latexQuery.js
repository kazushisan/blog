import { extract } from './extract.js';

const query = (list) =>
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
