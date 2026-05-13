import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import { authService, LoginCredentials, RegisterCredentials } from '../api/auth';
import { useRouter } from 'expo-router';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const queryClient = useQueryClient();
  const router = useRouter();

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Error checking auth status', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: async (data) => {
      if (data.token) {
        await SecureStore.setItemAsync('access_token', data.token);
        setIsAuthenticated(true);
        // Navigate to home after successful login
        router.replace('/(tabs)');
      } else {
        // Fallback for cases where token is nested or missing
        console.warn('Login successful but no access token received', data);
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: (credentials: RegisterCredentials) => authService.register(credentials),
    onSuccess: async (data) => {
      // You can redirect to sign in or log them in automatically based on logic
      router.replace('/sign-in');
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ password, token }: { password: string; token: string }) =>
      authService.resetPassword(password, token),
  });

  const verifyEmailMutation = useMutation({
    mutationFn: (code: string) => authService.verifyEmail(code),
  });

  const logout = async () => {
    await SecureStore.deleteItemAsync('access_token');
    setIsAuthenticated(false);
    queryClient.clear();
    router.replace('/sign-in');
  };

  return {
    isAuthenticated,
    isLoading,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,

    forgotPasswordAsync: forgotPasswordMutation.mutateAsync,
    isForgottingPassword: forgotPasswordMutation.isPending,

    resetPasswordAsync: resetPasswordMutation.mutateAsync,
    isResettingPassword: resetPasswordMutation.isPending,

    verifyEmailAsync: verifyEmailMutation.mutateAsync,
    isVerifyingEmail: verifyEmailMutation.isPending,

    logout,
  };
}
