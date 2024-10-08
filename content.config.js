// config for vite-plugin-content
const getTime = (date) => (new Date(date).getTime() / 1000) | 0;

export const query = (list) =>
  list.sort((a, b) => (getTime(b.data.date) - getTime(a.data.date)) | 0);
