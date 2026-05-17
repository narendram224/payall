import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from '@/components/ui/button';

const Loan = () => {
  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 }}>
      <View className="mb-2">
        <Text className="text-xs font-medium text-muted-foreground tracking-wider uppercase">FINANCE</Text>
      </View>
      <View className="space-y-6 mt-2">
        <Text className="text-2xl font-bold text-foreground">Instant Loan</Text>
        <Text className="text-muted-foreground text-base leading-relaxed">
          Apply for a personal loan with minimal documentation and instant approval. Flexible tenure and competitive interest rates.
        </Text>
        <View className="rounded-2xl bg-card border border-border p-5">
          <Text className="text-sm font-semibold text-foreground mb-3">Loan Amount Required</Text>
          <Text className="text-sm text-muted-foreground mb-4">Enter the amount you need and select your preferred tenure to proceed.</Text>
          <Button className="w-full mt-2">
            <Text className="font-semibold text-primary-foreground">Apply Now</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default Loan;
