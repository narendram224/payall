import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from '@/components/ui/button';

const BikeInsurance = () => {
  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 }}>
      <View className="mb-2">
        <Text className="text-xs font-medium text-muted-foreground tracking-wider uppercase">INSURANCE</Text>
      </View>
      <View className="space-y-6 mt-2">
        <Text className="text-2xl font-bold text-foreground">Bike Insurance</Text>
        <Text className="text-muted-foreground text-base leading-relaxed">
          Renew or buy new two-wheeler insurance. Enter your bike registration number to get a quick quote and secure your ride in minutes.
        </Text>
        <View className="rounded-2xl bg-card border border-border p-5">
          <Text className="text-sm font-semibold text-foreground mb-3">Vehicle Registration Number</Text>
          <Text className="text-sm text-muted-foreground mb-4">Enter your two-wheeler registration number to check insurance status or buy a new policy.</Text>
          <Button className="w-full mt-2">
            <Text className="font-semibold text-primary-foreground">Get Quote</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default BikeInsurance;
