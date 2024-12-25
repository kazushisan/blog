declare module '@vercel/og' {
  declare type ImageResponseOptions = ConstructorParameters<
    typeof import('../node_modules/@vercel/og').ImageResponse
  >[1];

  interface Element {
    type: 'div';
    props: {
      style?: Record<string, string | number>;
      children?: Element | string | (Element | string)[];
    };
  }

  class ImageResponse extends Response {
    constructor(element: Element, options?: ImageResponseOptions);
  }
}
