import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Bike, Car, Heart, Shield, ChevronRight } from 'lucide-react-native';

const InsuranceHub = () => {
  const insuranceTypes = [
    { icon: Bike, label: 'Bike', route: '/services/insurance/bike', color: '#6366f1', description: 'Two-wheeler insurance' },
    { icon: Car, label: 'Car', route: '/services/insurance/car', color: '#10b981', description: 'Four-wheeler insurance' },
    { icon: Heart, label: 'Health', route: '/services/insurance/health', color: '#f97316', description: 'Medical coverage' },
    { icon: Shield, label: 'Life', route: '/services/insurance/life', color: '#8b5cf6', description: 'Life protection' },
  ];

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 }}>
      <View className="mb-2">
        <Text className="text-xs font-medium text-muted-foreground tracking-wider uppercase">INSURANCE</Text>
      </View>

      <Text className="text-2xl font-bold text-foreground mb-1 mt-2">Insurance</Text>
      <Text className="text-muted-foreground mb-6">
        Protect what matters most — choose an insurance type to get started.
      </Text>

      <View className="space-y-3">
        {insuranceTypes.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => router.push(item.route)}
            activeOpacity={0.7}
            className="flex-row items-center justify-between rounded-2xl bg-card border border-border p-4"
          >
            <View className="flex-row items-center gap-3">
              <View className="h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: `${item.color}15` }}>
                <item.icon size={24} color={item.color} />
              </View>
              <View>
                <Text className="text-base font-semibold text-foreground">{item.label}</Text>
                <Text className="text-xs text-muted-foreground mt-0.5">{item.description}</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9ca3af" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default InsuranceHub;
