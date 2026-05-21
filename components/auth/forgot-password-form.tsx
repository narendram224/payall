import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { GradientButton } from '@/components/ui/gradient-button';
import { useAuth } from '@/hooks/useAuth';
import ErrorMsg from '@/components/ui/error-msg';

interface ForgotPasswordFormData {
  email: string;
}

export function ForgotPasswordForm() {
  const router = useRouter();
  const { forgotPasswordAsync, isForgottingPassword } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: '',
    },
    mode: 'onSubmit',
  });

  const validationRules = {
    email: {
      required: 'Email is required',
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address',
      },
    },
  };

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await forgotPasswordAsync(data.email);
    // Navigate to verify email or show success state
    router.replace('/verify-email');
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
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit(onSubmit)}
                />
                {error && <ErrorMsg message={error.message} />}
              </View>
            )}
          />
        </View>

        <GradientButton
          text={isForgottingPassword ? 'Sending...' : 'Send Reset Link'}
          onPress={handleSubmit(onSubmit)}
          loading={isForgottingPassword}
        />
      </View>
      <Text className="mt-4 text-center text-sm">
        Remember your password?{' '}
        <Link href="/sign-in">
          <Text className="text-sm text-primary underline underline-offset-4">Sign in</Text>
        </Link>
      </Text>
    </View>
  );
}
