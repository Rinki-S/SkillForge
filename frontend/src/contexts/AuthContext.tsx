import React, { createContext, useContext, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/client';
import {
  clearStoredUser,
  clearToken,
  getStoredUser,
  getToken,
  setStoredUser,
  setToken,
  type StoredUser,
} from '../lib/authStorage';

interface AuthContextValue {
  user: StoredUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (payload: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  isLoggingIn: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => getToken());
  const [user, setUser] = useState<StoredUser | null>(() => getStoredUser());
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      const nextUser: StoredUser = {
        id: data.userId ?? data.id,
        username: data.username,
        role: data.role,
      };
      setToken(data.token);
      setStoredUser(nextUser);
      setTokenState(data.token);
      setUser(nextUser);
    },
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isAdmin: user?.role === 'ADMIN',
      login: async (payload) => {
        await loginMutation.mutateAsync(payload);
      },
      logout: () => {
        clearToken();
        clearStoredUser();
        setTokenState(null);
        setUser(null);
        queryClient.clear();
      },
      isLoggingIn: loginMutation.isPending,
    }),
    [loginMutation, queryClient, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
