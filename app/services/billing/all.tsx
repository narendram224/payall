import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const AllBills = () => {
  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 }}>
      <View className="mb-2">
        <Text className="text-xs font-medium text-muted-foreground tracking-wider uppercase">ALL BILLS</Text>
      </View>
      <View className="space-y-6 mt-2">
        <Text className="text-2xl font-bold text-foreground">All Bills</Text>
        <Text className="text-muted-foreground text-base leading-relaxed">
          View and pay all your outstanding bills — electricity, water, gas, broadband, cable, landline, and more — from one place.
        </Text>
        <View className="rounded-2xl bg-card border border-border p-5">
          <Text className="text-sm font-semibold text-foreground mb-2">Coming Soon</Text>
          <Text className="text-sm text-muted-foreground">
            A consolidated view of all your upcoming and past-due bills will be available here shortly.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default AllBills;
