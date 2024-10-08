import { StrictMode } from 'react';
import { App } from './App';
import { HelmetProvider } from 'react-helmet-async';
import { ServerRouter } from './router';

export const render = ({
  path,
  context,
}: {
  path: string;
  context: object;
}) => (
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
