declare module '@vercel/og' {
  interface Element {
    type: 'div';
    props: {
      style?: Record<string, string | number>;
      children?: Element | string;
    };
  }

  class ImageResponse extends Response {
    constructor(element: Element, options?: ImageResponseOptions);
  }
}
