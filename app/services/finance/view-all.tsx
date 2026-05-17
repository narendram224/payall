import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const FinanceViewAll = () => {
  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 }}>
      <View className="mb-2">
        <Text className="text-xs font-medium text-muted-foreground tracking-wider uppercase">FINANCE</Text>
      </View>
      <View className="space-y-6 mt-2">
        <Text className="text-2xl font-bold text-foreground">All Finance Services</Text>
        <Text className="text-muted-foreground text-base leading-relaxed">
          Explore all finance services including loans, DMT, payout, investments, and more in one place.
        </Text>
        <View className="rounded-2xl bg-card border border-border p-5">
          <Text className="text-sm font-semibold text-foreground mb-2">Coming Soon</Text>
          <Text className="text-sm text-muted-foreground">
            A consolidated view of all finance services will be available shortly.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default FinanceViewAll;
