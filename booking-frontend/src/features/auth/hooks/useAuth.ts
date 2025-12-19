import { useCallback, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import type { Credentials, User } from '../types';

type UseAuthResult = {
  user: User | null;
  loading: boolean;
  signIn: (credentials: Credentials) => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuth = (): UseAuthResult => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      setLoading(true);
      const existing = await authService.currentUser();
      setUser(existing);
      setLoading(false);
    };
    void bootstrap();
  }, []);

  const signIn = useCallback(async (credentials: Credentials) => {
    const authed = await authService.signIn(credentials);
    setUser(authed);
  }, []);

  const signOut = useCallback(async () => {
    await authService.signOut();
    setUser(null);
  }, []);

  return { user, loading, signIn, signOut };
};

export default useAuth;


