import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from '@/components/ui/button';

const FastagRecharge = () => {
  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 }}>
      <View className="mb-2">
        <Text className="text-xs font-medium text-muted-foreground tracking-wider uppercase">FASTAG</Text>
      </View>
      <View className="space-y-6 mt-2">
        <Text className="text-2xl font-bold text-foreground">FASTag Recharge</Text>
        <Text className="text-muted-foreground text-base leading-relaxed">
          Recharge your FASTag instantly. Enter your vehicle number or FASTag ID to check current balance and recharge your tag for seamless toll payments.
        </Text>
        <View className="rounded-2xl bg-card border border-border p-5">
          <Text className="text-sm font-semibold text-foreground mb-3">Enter FASTag / Vehicle Details</Text>
          <Text className="text-sm text-muted-foreground mb-4">Enter your vehicle number to link the FASTag and recharge your account.</Text>
          <Button className="w-full mt-2">
            <Text className="font-semibold text-primary-foreground">Continue</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default FastagRecharge;
