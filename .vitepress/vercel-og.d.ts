declare module '@vercel/og' {
  declare type ImageResponseOptions = ConstructorParameters<
    typeof import('../node_modules/@vercel/og').ImageResponse
  >[1];

  type Element =
    | {
        type: 'div';
        props: {
          style?: Record<string, string | number>;
          children?: Element | string | (Element | string)[];
        };
      }
    | {
        type: 'img';
        props: {
          src: string;
          width: number;
          height: number;
          style?: Record<string, string | number>;
        };
      };

  class ImageResponse extends Response {
    constructor(element: Element, options?: ImageResponseOptions);
  }
}
