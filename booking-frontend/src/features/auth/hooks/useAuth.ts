import { useCallback, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import type { Credentials, Session, User } from '../types';

type UseAuthResult = {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (credentials: Credentials) => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuth = (): UseAuthResult => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      setLoading(true);
      const existing = await authService.currentSession();
      setUser(existing?.user ?? null);
      setToken(existing?.token ?? null);
      setLoading(false);
    };
    void bootstrap();
  }, []);

  const signIn = useCallback(async (credentials: Credentials) => {
    const session: Session = await authService.signIn(credentials);
    setUser(session.user);
    setToken(session.token);
  }, []);

  const signOut = useCallback(async () => {
    await authService.signOut(token ?? undefined);
    setUser(null);
    setToken(null);
  }, [token]);

  return { user, token, loading, signIn, signOut };
};

export default useAuth;


