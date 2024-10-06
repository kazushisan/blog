import { Helmet } from 'react-helmet-async';

export const Head = ({ title, path }: { title: string; path: string }) => (
  <Helmet>
    <title>{title}</title>
    <link href={`https://gadgetlunatic.com${path}`} rel="canonical" />
  </Helmet>
);
