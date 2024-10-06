import { useState } from 'react';
import { useLazyLatexList, useLazyPage } from '../hooks/useLazy';
import { Bar3, XMark } from '../components/Icon';
import { TableOfContents } from '../components/TableOfContents';
import { Link } from '../components/Link';
import { PostMeta } from '../components/PostMeta';
import { Head } from '../components/Head';

export const Latex = ({
  path,
  load,
}: {
  path: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  load: () => Promise<any>;
}) => {
  const match = useLazyPage(path, load);
  const pages = useLazyLatexList();
  const [show, setShow] = useState(false);

  return (
    <div className="xl:flex xl:justify-center">
      <Head
        title={`LaTeXのガイド ${match.title} | gadgetlunatic`}
        path={path}
      />
      <div>
        <div className="container md:mx-auto max-w-4xl xl:hidden">
          <div className="p-4 flex justify-between">
            <div className="text-slate-700 font-bold">
              <span>LaTeXのガイド</span>
              <span className="before:content-['/'] before:text-slate-300 before:m-1">
                {match.title}
              </span>
            </div>
            <button onClick={() => setShow((value) => !value)}>
              <Bar3 className="w-6" />
            </button>
          </div>
        </div>
        {show ? (
          <div className="fixed inset-0 flex-col flex z-10 xl:hidden">
            <nav className=" bg-white shadow overflow-y-scroll m-4 rounded-md flex-initial md:mx-auto md:m-4 md:w-[calc(100%-2rem)] max-w-4xl">
              <div className="flex justify-between p-4">
                <div className="text-slate-700 font-bold">LaTeXのガイド</div>
                <button onClick={() => setShow((value) => !value)}>
                  <XMark className="w-6" />
                </button>
              </div>
              <div className="mx-4 pb-2 border-slate-100 border-t">
                {pages.map((page) => (
                  <div
                    key={page.path}
                    className={`${path === page.path ? 'text-blue-500' : 'text-slate-700'} my-4`}
                  >
                    <Link
                      children={page.title}
                      to={page.path}
                      onClick={() => setShow(false)}
                    />
                  </div>
                ))}
              </div>
            </nav>
          </div>
        ) : null}
      </div>
      <div className="container md:mx-auto xl:mx-0 max-w-4xl box-content flex-none">
        <div className="px-4">
          <header>
            <h1 className="font-bold text-3xl my-8">{match.title}</h1>
            <div className="my-8">
              <PostMeta
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
        <div className="p-4 sticky mt-4 top-4">
          <nav className="mb-8 pb-8 border-b border-slate-100">
            <div className="font-bold">LaTeXのガイド</div>
            {pages.map((page) => (
              <div
                key={page.path}
                className={`${path === page.path ? 'text-blue-500' : 'text-slate-700'} my-2`}
              >
                <Link
                  children={page.title}
                  to={page.path}
                  onClick={() => setShow(false)}
                />
              </div>
            ))}
          </nav>
          <TableOfContents headings={match.headings} />
        </div>
      </div>
    </div>
  );
};
