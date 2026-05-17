import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from '@/components/ui/button';

const Silver = () => {
  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 }}>
      <View className="mb-2">
        <Text className="text-xs font-medium text-muted-foreground tracking-wider uppercase">FINANCE</Text>
      </View>
      <View className="space-y-6 mt-2">
        <Text className="text-2xl font-bold text-foreground">Silver Investment</Text>
        <Text className="text-muted-foreground text-base leading-relaxed">
          Invest in digital silver backed by physical silver. Start investing with amounts as low as ₹1 at live market rates.
        </Text>
        <View className="rounded-2xl bg-card border border-border p-5">
          <Text className="text-sm font-semibold text-foreground mb-3">Invest in Silver</Text>
          <Text className="text-sm text-muted-foreground mb-4">Enter the amount in INR you wish to invest in digital silver.</Text>
          <Button className="w-full mt-2">
            <Text className="font-semibold text-primary-foreground">Buy Silver</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default Silver;
