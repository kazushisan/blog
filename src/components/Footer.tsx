const year = new Date().getFullYear().toString();

export const Footer = ({ isArticle }: { isArticle: boolean }) => (
  <footer>
    <div
      className={`container md:mx-auto max-w-4xl box-content py-16 ${
        isArticle ? 'xl:pr-72' : ''
      }`}
    >
      <div className="p-4">
        <div>
          <h3 className="font-bold text-lg">gadgetlunatic</h3>
          <p>
            <a href="https://github.com/kazushisan/gadgetlunatic">
              github.com/kazushisan/gadgetlunatic
            </a>
          </p>
        </div>
        <div className="mt-4">
          <p>
            {`© ${year} `}
            <a
              className="text-blue-500 hover:text-blue"
              href="https://twitter.com/kazushikonosu"
            >
              @kazushikonosu
            </a>
          </p>
        </div>
      </div>
    </div>
  </footer>
);