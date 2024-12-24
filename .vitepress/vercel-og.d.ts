declare module '@vercel/og' {
  interface Element {
    type: 'div';
    props: {
      style?: Record<string, string | number>;
      children?: Element;
    };
  }

  class ImageResponse extends Response {
    constructor(Element, options?: ImageResponseOptions);
  }
}
