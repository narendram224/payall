import React from 'react';
import { View, ScrollView, StatusBar, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SignInForm } from '@/components/sign-in-form';
import { Image } from 'expo-image';

export default function SignInScreen() {
  return (
    <SafeAreaView className="flex-1">
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="flex-1 justify-center px-6 py-12">
            {/* Logo/Brand Section */}
            <View className="mb-8 items-center">
              <View className="mb-4 h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <Image
                  source={require('@/assets/icon.png')}
                  style={{ width: 80, height: 80 }}
                />
              </View>
              <Text className="text-2xl font-bold text-white">Pocket Money</Text>
              <Text className="mt-1 text-sm text-white/80">Your Digital Wallet</Text>
            </View>

            {/* Sign In Form */}
            <View className="rounded-3xl bg-white/10 p-6 backdrop-blur-md">
              <SignInForm />
            </View>

            {/* Footer */}
            <View className="mt-8 items-center">
              <Text className="text-sm text-white/60">Don&apos;t have an account?</Text>
              <TouchableOpacity className="mt-2">
                <Text className="font-semibold text-white">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
