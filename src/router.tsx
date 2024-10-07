import {
  createContext,
  ReactNode,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

const Router = createContext<{
  path: string;
  setPath: (path: string) => void;
} | null>(null);

export const useNavigate = () => {
  const context = useContext(Router);

  if (!context) {
    throw new Error('useNavigate must be used within a Router');
  }

  const navigate = useCallback((path: string) => {
    window.history.pushState({}, '', path);

    startTransition(() => context.setPath(path));
  }, []);

  return navigate;
};

const noop = () => void 0;

export const ServerRouter = ({
  path,
  children,
}: {
  path: string;
  children: ReactNode;
}) => (
  <Router.Provider value={{ path, setPath: noop }}>{children}</Router.Provider>
);

export const ClientRouter = ({ children }: { children: ReactNode }) => {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      startTransition(() => setPath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <Router.Provider value={{ path, setPath }}>{children}</Router.Provider>
  );
};

export const usePath = () => {
  const context = useContext(Router);

  if (!context) {
    throw new Error('usePath must be used within a Router');
  }

  return context.path;
};
