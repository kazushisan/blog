import { StrictMode } from 'react';
import { App } from './App';
import { HelmetProvider } from 'react-helmet-async';
import { ServerRouter } from './router';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const render = ({ path, context }: { path: string; context: {} }) => (
  <StrictMode
    children={
      <HelmetProvider context={context}>
        <ServerRouter path={path}>
          <App />
        </ServerRouter>
      </HelmetProvider>
    }
  />
);
