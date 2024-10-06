// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Head from '../components/Head.bs.js';
import * as Lazy from '../hooks/Lazy.bs.js';
import * as React from 'react';
import * as PostMeta from '../components/PostMeta.bs.js';
import * as TableOfContents from '../components/TableOfContents.bs.js';
function Post(props) {
  var path = props.path;
  var match = Lazy.useLazyPage(path, props.load);
  var title = match.title;
  return (
    <div className="xl:flex xl:justify-center">
      <Head.make title={`${title} | gadgetlunatic`} path={path} />
      <div className="container md:mx-auto xl:mx-0 max-w-4xl box-content flex-none">
        <div className="px-4">
          <header>
            <h1 className="font-bold text-3xl my-8">{title}</h1>
            <div className="my-8">
              <PostMeta.make
                date={match.date}
                permalink={match.permalink}
                modifiedDate={match.modifiedDate}
                hash={match.hash}
              />
            </div>
          </header>
          <article className="prose mb-16 max-w-none prose-slate">
            {match.element}
          </article>
        </div>
      </div>
      <div className="hidden xl:block flex-none w-72">
        <div className="p-4 sticky mt-40 top-40">
          <TableOfContents.make headings={match.headings} />
        </div>
      </div>
    </div>
  );
}
var make = Post;
export { make };
/* Head Not a pure module */
