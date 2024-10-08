import { useState, useEffect } from 'react';
import { Heading } from '../types';

const getPosition = (element: Element) =>
  (
    element.parentElement?.previousElementSibling || element
  ).getBoundingClientRect().bottom;

const getHeadingElements = (headings: Heading[]) =>
  Array.from(
    document.querySelectorAll(
      headings.map((heading) => `#${heading.id}`).join(','),
    ),
  );

export const TableOfContents = (props: { headings: Heading[] }) => {
  const headings = props.headings;
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(() => {
      const headingElements = getHeadingElements(headings);
      const firstElement = headingElements[0];

      if (headingElements.length <= 0 || !firstElement) {
        return;
      }

      const target = headingElements.reduce(
        (acc, cur) => {
          const position = getPosition(cur);

          if (position > 0 || acc.position > position) {
            return acc;
          }

          return {
            position: position,
            id: cur.id,
          };
        },
        {
          position: getPosition(firstElement),
          id: firstElement.id,
        },
      );

      if (activeId === target.id) {
        return;
      }

      setActiveId(target.id);
    });

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      const sibling = element?.parentElement?.previousElementSibling;

      if (sibling) {
        observer.observe(sibling);

        return;
      }

      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  return (
    <ul>
      {headings
        .filter((heading) => heading.depth === 2 || heading.depth === 3)
        .map((heading) => (
          <li
            key={heading.id}
            className={`list-none px-2 py-1 my-1 block text-sm ${
              heading.depth !== 2
                ? heading.id === activeId
                  ? 'bg-blue-100 text-blue-500 rounded ml-2 font-bold'
                  : 'text-slate-700 ml-2'
                : heading.id === activeId
                  ? 'bg-blue-100 text-blue-500 rounded font-bold'
                  : 'text-slate-700'
            }`}
          >
            <a href={`#${heading.id}`}>{heading.value}</a>
          </li>
        ))}
    </ul>
  );
};
