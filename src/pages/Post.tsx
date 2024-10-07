import { ProcessedPost } from 'content:routes';
import { Head } from '../components/Head';
import { PostMeta } from '../components/PostMeta';
import { TableOfContents } from '../components/TableOfContents';
import { useLazyPost } from '../hooks/useLazy';

export const Post = ({
  path,
  load,
}: {
  path: string;
  load: () => Promise<ProcessedPost>;
}) => {
  const post = useLazyPost(path, load);
  const title = post.title;

  return (
    <div className="xl:flex xl:justify-center">
      <Head title={`${title} | gadgetlunatic`} path={path} />
      <div className="container md:mx-auto xl:mx-0 max-w-4xl box-content flex-none">
        <div className="px-4">
          <header>
            <h1 className="font-bold text-3xl my-8">{title}</h1>
            <div className="my-8">
              <PostMeta
                date={post.date}
                permalink={post.permalink}
                modifiedDate={post.modifiedDate}
                hash={post.hash}
              />
            </div>
          </header>
          <article className="prose mb-16 max-w-none prose-slate">
            {post.element}
          </article>
        </div>
      </div>
      <div className="hidden xl:block flex-none w-72">
        <div className="p-4 sticky mt-40 top-40">
          <TableOfContents headings={post.headings} />
        </div>
      </div>
    </div>
  );
};
