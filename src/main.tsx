import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { App } from './App';
import { ClientRouter } from './router';

const container = document.querySelector('#root');

if (container) {
  hydrateRoot(
    container,
    <StrictMode
      children={
        <HelmetProvider>
          <ClientRouter>
            <App />
          </ClientRouter>
        </HelmetProvider>
      }
    />,
  );
}
