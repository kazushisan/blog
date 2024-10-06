import { StrictMode } from 'react';
import { App } from './App';
import { HelmetProvider } from 'react-helmet-async';
import { ServerRouter } from './utils/router';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const render = ({ url, context }: { url: string; context: {} }) => (
  <StrictMode
    children={
      <HelmetProvider context={context}>
        <ServerRouter url={url}>
          <App />
        </ServerRouter>
      </HelmetProvider>
    }
  />
);
