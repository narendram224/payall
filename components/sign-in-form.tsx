import { SocialConnections } from '@/components/social-connections';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { type TextInput, View, Pressable } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { Link, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { GradientButton } from './ui/gradient-button';
import { useAuth } from '../hooks/useAuth';
import ErrorMsg from './ui/error-msg';

interface SignInFormData {
  email: string;
  password: string;
}

export function SignInForm() {
  const passwordInputRef = React.useRef<TextInput>(null);
  const router = useRouter();
  const { loginAsync, isLoggingIn } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    setError,
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
    await loginAsync({ email: data.email, password: data.password });
  };

  return (
    <View>
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
                  className="h-14 bg-white"
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
                {error && <ErrorMsg message={error.message} />}
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
                <View className="relative justify-center">
                  <Input
                    id="password"
                    className="h-14 bg-white pr-12"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter your password"
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                    onSubmitEditing={onEmailSubmitEditing}
                    returnKeyType="done"
                    submitBehavior="submit"
                    ref={passwordInputRef}
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    className="absolute right-4 p-1"
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#666" />
                    ) : (
                      <Eye size={20} color="#666" />
                    )}
                  </Pressable>
                </View>
                {error && <ErrorMsg message={error.message} />}
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
              router.push('/forgot-password');
            }}>
            <Text className="font-normal leading-4">Forgot your password?</Text>
          </Button>
        </View>

        <GradientButton
          text={isLoggingIn ? 'Signing in...' : 'Continue'}
          onPress={handleSubmit(onSubmit)}
          loading={isLoggingIn}
        />
      </View>
      <Text className="mt-4 text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up">
          <Text className="text-sm text-primary underline underline-offset-4">Sign up</Text>
        </Link>
      </Text>
      <View className="mb-4 mt-2 flex-row items-center">
        <Separator className="flex-1" />
        <Text className="px-4 text-sm text-muted-foreground">or</Text>
        <Separator className="flex-1" />
      </View>
      <SocialConnections />
    </View>
  );
}
