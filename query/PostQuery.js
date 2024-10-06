// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Extract from './Extract.bs.js';

function getTime(date) {
  return (new Date(date).getTime() / 1000) | 0;
}

function query(list) {
  return list
    .map(Extract.extract)
    .filter(function (item) {
      return item.path.startsWith('/post');
    })
    .sort(function (a, b) {
      return (getTime(b.date) - getTime(a.date)) | 0;
    });
}

var $$default = query;

export { getTime, query, $$default, $$default as default };
/* No side effect */