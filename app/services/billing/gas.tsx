import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from '@/components/ui/button';

const GasBill = () => {
  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 }}>
      <View className="mb-2">
        <Text className="text-xs font-medium text-muted-foreground tracking-wider uppercase">GAS BILL</Text>
      </View>
      <View className="space-y-6 mt-2">
        <Text className="text-2xl font-bold text-foreground">Gas Bill Payment</Text>
        <Text className="text-muted-foreground text-base leading-relaxed">
          Pay your domestic gas bill online. Enter your customer ID or LPG account number to view and settle your outstanding bill.
        </Text>
        <View className="rounded-2xl bg-card border border-border p-5">
          <Text className="text-sm font-semibold text-foreground mb-3">Customer ID</Text>
          <Text className="text-sm text-muted-foreground mb-4">Enter your gas agency customer ID from your bill.</Text>
          <Button className="w-full mt-2">
            <Text className="font-semibold text-primary-foreground">Fetch Bill</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default GasBill;
