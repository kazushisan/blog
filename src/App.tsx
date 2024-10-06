import { ReactNode } from 'react';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { useUrl } from './utils/router';
import ContentRoutes from 'content:routes';
import { Post } from './pages/Post';
import { Latex } from './pages/Latex';
import { PostList } from './pages/PostList';

const Layout = ({
  children,
  isArticle,
}: {
  children: ReactNode;
  isArticle: boolean;
}) => (
  <div className="flex flex-col min-h-screen">
    <div className="flex-none">
      <Header isArticle={isArticle} />
    </div>
    <div className="flex-auto">{children}</div>
    <div className="flex-none">
      <Footer isArticle={isArticle} />
    </div>
  </div>
);

export const App = () => {
  const url = useUrl();
  const path = url;
  const target = ContentRoutes.find((item) => item.path === path);
  const match = target;

  if (match) {
    if (path.startsWith('/latex')) {
      return (
        <Layout
          children={<Latex path={target.path} load={target.load} />}
          isArticle={true}
        />
      );
    }
    if (path.startsWith('/post')) {
      return (
        <Layout
          children={<Post path={target.path} load={target.load} />}
          isArticle={true}
        />
      );
    }
  }

  if (path === '/') {
    return <Layout children={<PostList />} isArticle={false} />;
  }

  return <Layout children="page not found" isArticle={false} />;
};
