import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

const Router = createContext<{ url: string } | null>(null);

export const useNavigate = () => {
  const context = useContext(Router);

  if (!context) {
    throw new Error('useNavigate must be used within a Router');
  }

  const navigate = useCallback((url: string) => {
    window.history.pushState({}, '', url);
  }, []);

  return navigate;
};

export const ServerRouter = ({
  url,
  children,
}: {
  url: string;
  children: ReactNode;
}) => <Router.Provider value={{ url }}>{children}</Router.Provider>;

export const ClientRouter = ({ children }: { children: ReactNode }) => {
  const [url, setUrl] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setUrl(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return <Router.Provider value={{ url }}>{children}</Router.Provider>;
};

export const useUrl = () => {
  const context = useContext(Router);

  if (!context) {
    throw new Error('useUrl must be used within a Router');
  }

  return context.url;
};
