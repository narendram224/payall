import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { type TextInput, View, Pressable } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { GradientButton } from './ui/gradient-button';
import { useAuth } from '../hooks/useAuth';
import ErrorMsg from './ui/error-msg';

interface ResetPasswordFormData {
  token: string;
  password: string;
}

export function ResetPasswordForm() {
  const passwordInputRef = React.useRef<TextInput>(null);
  const router = useRouter();
  const { resetPasswordAsync, isResettingPassword } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    defaultValues: {
      token: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const validationRules = {
    token: { required: 'Reset token is required' },
    password: {
      required: 'New password is required',
      minLength: {
        value: 6,
        message: 'Password must be at least 6 characters',
      },
    },
  };

  const onSubmit = async (data: ResetPasswordFormData) => {
    await resetPasswordAsync({ password: data.password, token: data.token });
    router.replace('/sign-in');
  };

  return (
    <View>
      <View className="gap-6">
        <View className="gap-1.5">
          <Label htmlFor="token">Reset Token</Label>
          <Controller
            control={control}
            name="token"
            rules={validationRules.token}
            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
               <View>
                 <Input
                   id="token"
                   className="h-14 bg-white"
                   value={value}
                   onChangeText={onChange}
                   onBlur={onBlur}
                   placeholder="Enter your token"
                   autoCapitalize="none"
                   returnKeyType="next"
                   onSubmitEditing={() => passwordInputRef.current?.focus()}
                 />
                 {error && <ErrorMsg message={error.message} />}
               </View>
            )}
          />
        </View>

        <View className="gap-1.5">
          <Label htmlFor="password">New Password</Label>
          <Controller
            control={control}
            name="password"
            rules={validationRules.password}
            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
               <View>
                 <View className="relative justify-center">
                   <Input
                     ref={passwordInputRef}
                     id="password"
                     className="h-14 bg-white pr-12"
                     value={value}
                     onChangeText={onChange}
                     onBlur={onBlur}
                     placeholder="Enter your new password"
                     secureTextEntry={!showPassword}
                     autoComplete="password-new"
                     returnKeyType="done"
                     onSubmitEditing={handleSubmit(onSubmit)}
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

        <GradientButton
          text={isResettingPassword ? 'Resetting...' : 'Reset Password'}
          onPress={handleSubmit(onSubmit)}
          loading={isResettingPassword}
        />
      </View>
    </View>
  );
}
