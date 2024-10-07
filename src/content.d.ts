declare module 'content:posts' {
  export interface PostListItem {
    title: string;
    date: string;
    hash: string | undefined;
    permalink: string | undefined;
    modifiedDate: string | undefined;
    path: string;
  }

  const posts: PostListItem[];

  export default posts;
}

declare module 'content:routes' {
  import { PostListItem } from 'content:posts';

  const routes: {
    path: string;
    file: string;
    load: () => Promise<ProcessedPost>;
  }[];

  export interface ProcessedPost extends PostListItem {
    headings: { id: string; value: string; level: number; depth: number }[];
    default: React.ComponentType;
  }

  export default routes;
}
