import React, { createContext, useContext } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from './api';
import { User, Track } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, track: Track) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const meQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async (): Promise<User | null> => {
      try {
        return await api.get<User>('/auth/me');
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) return null;
        throw err;
      }
    },
    retry: false,
    staleTime: Infinity,
  });

  const loginMutation = useMutation({
    mutationFn: (params: { email: string; password: string }) => api.post<User>('/auth/login', params),
    onSuccess: (user) => queryClient.setQueryData(['auth', 'me'], user),
  });

  const registerMutation = useMutation({
    mutationFn: (params: { email: string; password: string; name: string; track: Track }) =>
      api.post<User>('/auth/register', params),
    onSuccess: (user) => queryClient.setQueryData(['auth', 'me'], user),
  });

  const logoutMutation = useMutation({
    mutationFn: () => api.post<void>('/auth/logout'),
    onSuccess: () => queryClient.setQueryData(['auth', 'me'], null),
  });

  const value: AuthContextType = {
    user: meQuery.data ?? null,
    isLoading: meQuery.isLoading,
    login: async (email, password) => {
      await loginMutation.mutateAsync({ email, password });
    },
    register: async (email, password, name, track) => {
      await registerMutation.mutateAsync({ email, password, name, track });
    },
    logout: async () => {
      await logoutMutation.mutateAsync();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
