export const extract = (param) => {
  const path = param.path;
  const data = param.data;
  if (data.title === undefined) {
    throw new Error(`invalid data for ${path}`);
  }
  if (data.date === undefined) {
    throw new Error(`invalid data for ${path}`);
  }
  return {
    path: path,
    title: data.title || '',
    date: data.date || '',
    permalink: data.permalink,
    modifiedDate: data.modifiedDate,
    hash: data.hash,
    weight: data.weight || 0,
  };
};
