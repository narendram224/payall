import { SocialConnections } from '@/components/social-connections';
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

interface SignUpFormData {
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  password: string;
}

export function SignUpForm() {
  const lastNameInputRef = React.useRef<TextInput>(null);
  const emailInputRef = React.useRef<TextInput>(null);
  const mobileInputRef = React.useRef<TextInput>(null);
  const passwordInputRef = React.useRef<TextInput>(null);
  
  const router = useRouter();
  const { registerAsync, isRegistering } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      mobile: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const validationRules = {
    first_name: { required: 'First name is required' },
    last_name: { required: 'Last name is required' },
    email: {
      required: 'Email is required',
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address',
      },
    },
    mobile: {
      required: 'Mobile number is required',
      pattern: {
        value: /^[0-9]{10}$/,
        message: 'Please enter a valid 10-digit mobile number',
      },
    },
    password: {
      required: 'Password is required',
      minLength: {
        value: 6,
        message: 'Password must be at least 6 characters',
      },
    },
  };

  const onSubmit = async (data: SignUpFormData) => {
    await registerAsync(data);
  };

  return (
    <View>
      <View className="gap-6">
        <View className="flex-row gap-4">
          <View className="flex-1 gap-1.5">
            <Label htmlFor="first_name">First Name</Label>
            <Controller
              control={control}
              name="first_name"
              rules={validationRules.first_name}
              render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                <View>
                  <Input
                    id="first_name"
                    className="h-14 bg-white"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="John"
                    autoCapitalize="words"
                    returnKeyType="next"
                    onSubmitEditing={() => lastNameInputRef.current?.focus()}
                  />
                  {error && <ErrorMsg message={error.message} />}
                </View>
              )}
            />
          </View>
          <View className="flex-1 gap-1.5">
            <Label htmlFor="last_name">Last Name</Label>
            <Controller
              control={control}
              name="last_name"
              rules={validationRules.last_name}
              render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                <View>
                  <Input
                    ref={lastNameInputRef}
                    id="last_name"
                    className="h-14 bg-white"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Doe"
                    autoCapitalize="words"
                    returnKeyType="next"
                    onSubmitEditing={() => emailInputRef.current?.focus()}
                  />
                  {error && <ErrorMsg message={error.message} />}
                </View>
              )}
            />
          </View>
        </View>

        <View className="gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Controller
            control={control}
            name="email"
            rules={validationRules.email}
            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
               <View>
                 <Input
                   ref={emailInputRef}
                   id="email"
                   className="h-14 bg-white"
                   value={value}
                   onChangeText={onChange}
                   onBlur={onBlur}
                   placeholder="m@example.com"
                   keyboardType="email-address"
                   autoComplete="email"
                   autoCapitalize="none"
                   returnKeyType="next"
                   onSubmitEditing={() => mobileInputRef.current?.focus()}
                 />
                 {error && <ErrorMsg message={error.message} />}
               </View>
            )}
          />
        </View>

        <View className="gap-1.5">
          <Label htmlFor="mobile">Mobile Number</Label>
          <Controller
            control={control}
            name="mobile"
            rules={validationRules.mobile}
            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
               <View>
                 <Input
                   ref={mobileInputRef}
                   id="mobile"
                   className="h-14 bg-white"
                   value={value}
                   onChangeText={onChange}
                   onBlur={onBlur}
                   placeholder="Enter 10-digit number"
                   keyboardType="phone-pad"
                   returnKeyType="next"
                   onSubmitEditing={() => passwordInputRef.current?.focus()}
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
                     ref={passwordInputRef}
                     id="password"
                     className="h-14 bg-white pr-12"
                     value={value}
                     onChangeText={onChange}
                     onBlur={onBlur}
                     placeholder="Enter your password"
                     secureTextEntry={!showPassword}
                     autoComplete="password"
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
          text={isRegistering ? 'Signing up...' : 'Create Account'}
          onPress={handleSubmit(onSubmit)}
          loading={isRegistering}
        />
      </View>
      <Text className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <Link href="/sign-in">
          <Text className="text-sm text-primary underline underline-offset-4">Sign in</Text>
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
