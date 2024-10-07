declare module 'content:posts' {
  export interface PostListItem {
    data: {
      title: string;
      date: string;
      hash: string | undefined;
      permalink: string | undefined;
      modifiedDate: string | undefined;
    };
    path: string;
  }

  const posts: PostListItem[];

  export default posts;
}

declare module 'content:routes' {
  const routes: {
    path: string;
    load: () => Promise<ProcessedPost>;
  }[];

  export interface ProcessedPost {
    title: string;
    date: string;
    hash: string | undefined;
    permalink: string | undefined;
    modifiedDate: string | undefined;
    headings: { id: string; value: string; level: number; depth: number }[];
    default: React.ComponentType;
  }

  export default routes;
}
