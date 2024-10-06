import { Link } from './Link';

export const Header = ({ isArticle }: { isArticle: boolean }) => (
  <header>
    <div
      className={`container md:mx-auto max-w-4xl box-content ${
        isArticle ? 'xl:pr-72' : ''
      }`}
    >
      <div className="p-4 flex justify-start items-center">
        <Link
          children={<h1 className="font-bold text-lg">gadgetlunatic</h1>}
          to="/"
        />
        <Link
          children="ブログ"
          to="/"
          className="text-slate-700 ml-4 text-sm"
        />
        <div className="text-slate-300 mx-1 text-sm">/</div>
        <Link
          children="LaTeXのガイド"
          to="/latex/introduction"
          className="text-slate-700 text-sm"
        />
      </div>
    </div>
  </header>
);
