import { useLazyPosts } from '../hooks/useLazy';
import { PostMeta } from '../components/PostMeta';
import { Head } from '../components/Head';
import { Link } from '../components/Link';

export const PostList = () => {
  const posts = useLazyPosts();

  return (
    <div className="xl:flex xl:justify-center">
      <Head title="gadgetlunatic" path="" />
      <div className="container md:mx-auto xl:mx-0 max-w-4xl flex-1 min-w-0">
        <div className="px-4">
          {posts.map((post) => (
            <div
              key={post.path}
              className="mt-8 pt-8 first-of-type:border-t-0 border-t border-slate-100"
            >
              <Link to={post.path}>
                <h1 className="font-bold text-xl mb-4">{post.data.title}</h1>
              </Link>
              <PostMeta
                date={post.data.date}
                permalink={post.data.permalink}
                modifiedDate={post.data.modifiedDate}
                hash={post.data.hash}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
