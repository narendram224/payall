import React from 'react';
import { View, ScrollView, StatusBar, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SignInForm } from '@/components/auth/sign-in-form';
import { Image } from 'expo-image';

export default function SignInScreen() {
  return (
    <SafeAreaView className="flex-1">
      <StatusBar barStyle="light-content" />

      <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
        <View className="flex-1 justify-center px-6 py-12">
          {/* Logo/Brand Section */}
          <View className="mb-8 items-center">
            <View className="mb-4 h-40 w-40 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Image
                source={require('@/assets/icon.png')}
                style={{ width: 80, height: 80 }}
                contentFit="contain"
              />
            </View>
            <Text className="text-2xl font-bold text-secondary">Pocket Money</Text>
            <Text className="mt-1 text-sm text-muted-foreground">Your Digital Wallet</Text>
          </View>
          <SignInForm />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
