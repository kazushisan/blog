declare module 'content:posts' {
  import { PostListItem } from './types/Heading';

  const posts: PostListItem[];

  export default posts;
}

declare module 'content:routes' {
  import { ProcessedPost } from './types';

  const routes: {
    path: string;
    file: string;
    load: () => Promise<ProcessedPost>;
  }[];

  export default routes;
}
