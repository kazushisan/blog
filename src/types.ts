export type Heading = {
  value: string;
  depth: number;
  id: string;
};

export interface PostListItem {
  title: string;
  date: string;
  hash: string | undefined;
  permalink: string | undefined;
  modifiedDate: string | undefined;
  path: string;
}

export interface ProcessedPost extends PostListItem {
  headings: { id: string; value: string; level: number; depth: number }[];
  default: React.ComponentType;
}
