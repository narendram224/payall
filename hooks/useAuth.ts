import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import { authService } from '@/services/auth/auth.service';
import { useRouter } from 'expo-router';
import { LoginCredentials, RegisterCredentials } from '@/services/auth/auth.dto';

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

const { data: authState = { isAuthenticated: false, hasCompletedOnboarding: false }, isLoading } = useQuery({
  queryKey: ['auth_status'],
  queryFn: async () => {
    try {
      const [token, hasCompletedOnboarding] = await Promise.all([
        SecureStore.getItemAsync('access_token'),
        SecureStore.getItemAsync('hasCompletedOnboarding'),
      ]);
      return {
        isAuthenticated: !!token,
        hasCompletedOnboarding: hasCompletedOnboarding === 'true',
      };
    } catch (error) {
      console.error('Error checking auth status', error);
      return { isAuthenticated: false, hasCompletedOnboarding: false };
    }
  },
  staleTime: Infinity,
});

// 🌟 NEW HYDRATION HELPER: Updates both disk and memory cache instantly
  const setOnboardingComplete = async () => {
    try {
      await SecureStore.setItemAsync('hasCompletedOnboarding', 'true');
      queryClient.setQueryData(['auth_status'], (old: any) => ({
        ...(old || {}),
        hasCompletedOnboarding: true,
      }));
    } catch (error) {
      console.error('Error writing onboarding complete state:', error);
    }
  };

  const { isAuthenticated, hasCompletedOnboarding } = authState;
  
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: async (data) => {
      if (data.token) {
        await SecureStore.setItemAsync('access_token', data.token);
        queryClient.setQueryData(['auth_status'], (old: any) => ({
          ...(old || {}),
          isAuthenticated: true,
        }));
        queryClient.setQueryData(['auth_status'], (old: any) => ({
          ...(old || {}),
          isAuthenticated: true,
        }));
        console.log("Auth Success", data.token);

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
  try {
    // 1. Clear the authentication token from local hardware storage
 const logout = async () => {
  try {
    // 1. Clear the authentication token from local hardware storage
    await SecureStore.deleteItemAsync('access_token');
    
    // 2. Instead of queryClient.clear(), explicitly update the auth payload 
    // or invalidate it so it fetches fresh data from SecureStore
    queryClient.setQueryData(['auth_status'], (old: any) => {
      return {
        isAuthenticated: false,
        // Keep the old flag if it exists, otherwise fall back to true since they just logged out!
        hasCompletedOnboarding: old?.hasCompletedOnboarding ?? true, 
      };
    });

    // 3. Force clean redirect
    
    // 2. Instead of queryClient.clear(), explicitly update the auth payload 
    // or invalidate it so it fetches fresh data from SecureStore
    queryClient.setQueryData(['auth_status'], (old: any) => {
      return {
        isAuthenticated: false,
        // Keep the old flag if it exists, otherwise fall back to true since they just logged out!
        hasCompletedOnboarding: old?.hasCompletedOnboarding ?? true, 
      };
    });

    // 3. Force clean redirect
    router.replace('/sign-in');
  } catch (error) {
    console.error("Error during secure log out:", error);
  }
};
  } catch (error) {
    console.error("Error during secure log out:", error);
  }
};

  return {
    isAuthenticated,
    hasCompletedOnboarding,
    isLoading,
    setOnboardingComplete,
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
