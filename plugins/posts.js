const getTime = (date) => (new Date(date).getTime() / 1000) | 0;

const query = (list) =>
  list.sort((a, b) => (getTime(b.date) - getTime(a.date)) | 0);

export default query;
