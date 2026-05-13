import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { GradientButton } from './ui/gradient-button';
import { useAuth } from '../hooks/useAuth';
import ErrorMsg from './ui/error-msg';

interface VerifyEmailFormData {
  code: string;
}

export function VerifyEmailForm() {
  const router = useRouter();
  const { verifyEmailAsync, isVerifyingEmail } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailFormData>({
    defaultValues: {
      code: '',
    },
    mode: 'onSubmit',
  });

  const validationRules = {
    code: {
      required: 'Verification code is required',
    },
  };

  const onSubmit = async (data: VerifyEmailFormData) => {
    await verifyEmailAsync(data.code);
    router.replace('/sign-in');
  };

  return (
    <View>
      <View className="gap-6">
        <View className="gap-1.5">
          <Label htmlFor="code">Verification Code</Label>
          <Controller
            control={control}
            name="code"
            rules={validationRules.code}
            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
               <View>
                 <Input
                   id="code"
                   className="h-14 bg-white text-center text-lg tracking-widest"
                   value={value}
                   onChangeText={onChange}
                   onBlur={onBlur}
                   placeholder="------"
                   keyboardType="number-pad"
                   returnKeyType="done"
                   onSubmitEditing={handleSubmit(onSubmit)}
                 />
                 {error && <ErrorMsg message={error.message} />}
               </View>
            )}
          />
        </View>

        <GradientButton
          text={isVerifyingEmail ? 'Verifying...' : 'Verify Email'}
          onPress={handleSubmit(onSubmit)}
          loading={isVerifyingEmail}
        />
      </View>
    </View>
  );
}
