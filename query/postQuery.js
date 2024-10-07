import { extract } from './extract.js';

const getTime = (date) => (new Date(date).getTime() / 1000) | 0;

const query = (list) =>
  list
    .map(extract)
    .filter((item) => item.path.startsWith('/post'))
    .sort((a, b) => (getTime(b.date) - getTime(a.date)) | 0);

export default query;
