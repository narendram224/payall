import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const AllInsurance = () => {
  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 }}>
      <View className="mb-2">
        <Text className="text-xs font-medium text-muted-foreground tracking-wider uppercase">INSURANCE</Text>
      </View>
      <View className="space-y-6 mt-2">
        <Text className="text-2xl font-bold text-foreground">All Insurance</Text>
        <Text className="text-muted-foreground text-base leading-relaxed">
          Browse and compare all insurance products — bike, car, health, life, and more — in one place.
        </Text>
        <View className="rounded-2xl bg-card border border-border p-5">
          <Text className="text-sm font-semibold text-foreground mb-2">Comming Soon</Text>
          <Text className="text-sm text-muted-foreground">
            A unified marketplace for all insurance types is on the way.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default AllInsurance;
