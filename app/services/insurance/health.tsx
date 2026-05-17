import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from '@/components/ui/button';

const HealthInsurance = () => {
  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 }}>
      <View className="mb-2">
        <Text className="text-xs font-medium text-muted-foreground tracking-wider uppercase">INSURANCE</Text>
      </View>
      <View className="space-y-6 mt-2">
        <Text className="text-2xl font-bold text-foreground">Health Insurance</Text>
      <Text className="text-muted-foreground text-base leading-relaxed">
        Protect your family&#39;s health with comprehensive medical insurance plans. Enter your details to compare coverage and premiums.
      </Text>
        <View className="rounded-2xl bg-card border border-border p-5">
          <Text className="text-sm font-semibold text-foreground mb-3">Get a Health Plan</Text>
          <Text className="text-sm text-muted-foreground mb-4">Compare health insurance plans for individuals and families from leading providers.</Text>
          <Button className="w-full mt-2">
            <Text className="font-semibold text-primary-foreground">Explore Plans</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default HealthInsurance;
