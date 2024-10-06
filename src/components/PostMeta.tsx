import { Fragment } from 'react';

const formatDateFromIso = (value: string) =>
  new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
  }).format(new Date(value));

export const PostMeta = ({
  date,
  permalink,
  modifiedDate,
  hash,
}: {
  date: string;
  permalink?: string;
  modifiedDate?: string;
  hash?: string;
}) => (
  <div className="text-sm text-slate-500 items-center">
    <span>{formatDateFromIso(date)}</span>
    {!!modifiedDate && (
      <span className="before:content-['·'] before:px-1">
        {`last updated ${formatDateFromIso(modifiedDate)}`}
      </span>
    )}
    {permalink && hash ? (
      <Fragment>
        <span className="before:content-['·'] before:px-1">latest commit </span>
        <a
          className="bg-slate-50 inline- text-sm text-slate-700 inline-block border-slate-200 border rounded-sm px-1 font-mono ml-1 align-top"
          href={permalink}
          rel="noreferrer"
          target="_blank"
        >
          {hash.slice(0, 7)}
        </a>
      </Fragment>
    ) : null}
  </div>
);
