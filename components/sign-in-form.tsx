import { SocialConnections } from '@/components/social-connections';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Pressable, type TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import * as SecureStore from 'expo-secure-store';

// Temporary authentication credentials
const TEMP_CREDENTIALS = {
  email: 'a@a.com',
  password: '12345',
};

interface SignInFormData {
  email: string;
  password: string;
}

export function SignInForm() {
  const passwordInputRef = React.useRef<TextInput>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  // Validation rules
  const validationRules = {
    email: {
      required: 'Email is required',
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address',
      },
    },
    password: {
      required: 'Password is required',
      minLength: {
        value: 4,
        message: 'Password must be at least 4 characters',
      },
    },
  };

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);

    try {
      // Simulate authentication - in real app, this would be an API call
      if (data.email === TEMP_CREDENTIALS.email && data.password === TEMP_CREDENTIALS.password) {
        // Generate and store secure token
        const authToken = 'secure_token_' + Date.now();
        await SecureStore.setItemAsync('authToken', authToken);
        await SecureStore.setItemAsync('userEmail', data.email);

        // Mark as authenticated
        await SecureStore.setItemAsync('isAuthenticated', 'true');

        // Navigate to dashboard
        router.replace('/(tabs)');
      } else if (data.email === TEMP_CREDENTIALS.email) {
        // Correct email, wrong password - show OTP hint
        setErrors({ password: 'Incorrect password. Hint: OTP is 12345' });
      } else {
        setErrors({ email: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setErrors({ email: 'Authentication failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="gap-6">
      <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">Sign in to your app</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Welcome back! Please sign in to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Controller
                control={control}
                name="email"
                rules={validationRules.email}
                render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                  <View>
                    <Input
                      id="email"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="m@example.com"
                      keyboardType="email-address"
                      autoComplete="email"
                      autoCapitalize="none"
                      onSubmitEditing={onEmailSubmitEditing}
                      returnKeyType="next"
                      submitBehavior="submit"
                    />
                    {error && <Text className="mt-1 text-sm text-red-500">{error.message}</Text>}
                  </View>
                )}
              />
            </View>
            <View className="gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Controller
                control={control}
                name="password"
                rules={validationRules.password}
                render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                  <View>
                    <Input
                      id="password"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Enter your password"
                      secureTextEntry={true}
                      autoComplete="password"
                      onSubmitEditing={onEmailSubmitEditing}
                      returnKeyType="done"
                      submitBehavior="submit"
                      ref={passwordInputRef}
                    />
                    {error && <Text className="mt-1 text-sm text-red-500">{error.message}</Text>}
                  </View>
                )}
              />
            </View>
            <View className="flex-row items-center justify-between">
              <Button
                variant="link"
                size="sm"
                className="h-4 px-1 py-0"
                onPress={() => {
                  // TODO: Navigate to forgot password screen
                }}>
                <Text className="font-normal leading-4">Forgot your password?</Text>
              </Button>
            </View>
            <Button className="w-full" onPress={handleSubmit(onSubmit)} disabled={isLoading}>
              <Text>{isLoading ? 'Signing in...' : 'Continue'}</Text>
            </Button>
          </View>
          <Text className="text-center text-sm">
            Don&apos;t have an account?{' '}
            <Pressable
              onPress={() => {
                // TODO: Navigate to sign up screen
              }}>
              <Text className="text-sm underline underline-offset-4">Sign up</Text>
            </Pressable>
          </Text>
          <View className="flex-row items-center">
            <Separator className="flex-1" />
            <Text className="px-4 text-sm text-muted-foreground">or</Text>
            <Separator className="flex-1" />
          </View>
          <SocialConnections />
        </CardContent>
      </Card>
    </View>
  );
}
