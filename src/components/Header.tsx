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
      </div>
    </div>
  </header>
);
