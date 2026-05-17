import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from '@/components/ui/button';

const Emi = () => {
  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 }}>
      <View className="mb-2">
        <Text className="text-xs font-medium text-muted-foreground tracking-wider uppercase">FINANCE</Text>
      </View>
      <View className="space-y-6 mt-2">
        <Text className="text-2xl font-bold text-foreground">EMI Payment</Text>
        <Text className="text-muted-foreground text-base leading-relaxed">
          Pay your loan EMI online for any bank or NBFC. Enter your loan account number to view the outstanding amount and make a payment.
        </Text>
        <View className="rounded-2xl bg-card border border-border p-5">
          <Text className="text-sm font-semibold text-foreground mb-3">Loan Account Number</Text>
          <Text className="text-sm text-muted-foreground mb-4">Enter your loan or EMI account number to fetch the outstanding amount.</Text>
          <Button className="w-full mt-2">
            <Text className="font-semibold text-primary-foreground">Fetch EMI</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default Emi;
