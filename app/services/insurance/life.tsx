import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from '@/components/ui/button';

const LifeInsurance = () => {
  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 }}>
      <View className="mb-2">
        <Text className="text-xs font-medium text-muted-foreground tracking-wider uppercase">INSURANCE</Text>
      </View>
      <View className="space-y-6 mt-2">
        <Text className="text-2xl font-bold text-foreground">Life Insurance</Text>
      <Text className="text-muted-foreground text-base leading-relaxed">
        Secure your family&#39;s future with a life insurance plan that fits your needs. Explore term life and savings plans from top insurers.
      </Text>
        <View className="rounded-2xl bg-card border border-border p-5">
          <Text className="text-sm font-semibold text-foreground mb-3">Choose a Plan</Text>
          <Text className="text-sm text-muted-foreground mb-4">Enter your age and coverage amount to get personalised life insurance plan recommendations.</Text>
          <Button className="w-full mt-2">
            <Text className="font-semibold text-primary-foreground">Explore Plans</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default LifeInsurance;
