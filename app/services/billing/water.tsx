import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from '@/components/ui/button';

const WaterBill = () => {
  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 }}>
      <View className="mb-2">
        <Text className="text-xs font-medium text-muted-foreground tracking-wider uppercase">WATER BILL</Text>
      </View>
      <View className="space-y-6 mt-2">
        <Text className="text-2xl font-bold text-foreground">Water Bill Payment</Text>
        <Text className="text-muted-foreground text-base leading-relaxed">
          Pay your water bill online. Enter your consumer ID to view outstanding dues and make payment instantly.
        </Text>
        <View className="rounded-2xl bg-card border border-border p-5">
          <Text className="text-sm font-semibold text-foreground mb-3">Consumer ID</Text>
          <Text className="text-sm text-muted-foreground mb-4">Enter your water supply consumer ID found on your bill statement.</Text>
          <Button className="w-full mt-2">
            <Text className="font-semibold text-primary-foreground">Fetch Bill</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default WaterBill;
