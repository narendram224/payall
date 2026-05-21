import React from 'react';
import { View, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Assuming the shape based on typical DMT APIs
interface Beneficiary {
  id: string;
  beneficiary_name: string;
  bank_account_number: string;
  ifsc: string;
  bank_name: string;
  status?: string;
}

export default function BeneficiariesScreen() {
  const { mobile_number } = useLocalSearchParams<{ mobile_number: string }>();
  const router = useRouter();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['beneficiaries', mobile_number],
    queryFn: async () => {
      // The API uses query params
      const response = await apiClient.get('v2/dmt/beneficiary', {
        params: { mobile_number },
      });
      return response.data?.data || response.data || [];
    },
    enabled: !!mobile_number,
  });

  const beneficiaries: Beneficiary[] = Array.isArray(data) ? data : [];

  const handleAddBeneficiary = () => {
    router.push({
      pathname: '/dmt/add-beneficiary',
      params: { mobile_number },
    });
  };

  const handleTransfer = (beneficiary: Beneficiary) => {
    router.push({
      pathname: '/dmt/transfer',
      params: {
        mobile_number,
        dmtbeneficiary_id: beneficiary.id,
        beneficiary_name: beneficiary.beneficiary_name,
        bank_account_number: beneficiary.bank_account_number,
        bank_name: beneficiary.bank_name,
      },
    });
  };

  const renderItem = ({ item }: { item: Beneficiary }) => {
    const initials = item.beneficiary_name
      ? item.beneficiary_name.substring(0, 2).toUpperCase()
      : 'BN';

    // Mask account number: show last 4 digits
    const maskedAccount =
      item.bank_account_number?.length >= 4
        ? `•••• •••• ${item.bank_account_number.slice(-4)}`
        : item.bank_account_number;

    return (
      <Card className="mb-4 overflow-hidden bg-card">
        <Pressable className="flex-row items-center p-4" onPress={() => handleTransfer(item)}>
          <Avatar alt={item.beneficiary_name} className="mr-4 h-12 w-12 bg-primary/10">
            <AvatarFallback>
              <Text className="font-bold text-primary">{initials}</Text>
            </AvatarFallback>
          </Avatar>

          <View className="flex-1">
            <Text className="text-lg font-semibold text-foreground">{item.beneficiary_name}</Text>
            <Text className="mt-0.5 text-sm text-muted-foreground">
              {item.bank_name} • {maskedAccount}
            </Text>
          </View>

          <Button
            variant="secondary"
            size="sm"
            className="rounded-full"
            onPress={() => handleTransfer(item)}>
            <Text className="font-semibold text-primary">Pay</Text>
          </Button>
        </Pressable>
      </Card>
    );
  };

  return (
    <View className="flex-1 bg-background">
      <View className="border-b border-border bg-card px-6 pb-4 pt-6">
        <Text className="text-2xl font-bold text-foreground">Beneficiaries</Text>
        <Text className="text-muted-foreground">Select a recipient to send money</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" className="text-primary" />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center p-6">
          <Text className="mb-4 text-center text-destructive">
            Failed to load beneficiaries. Please try again.
          </Text>
          <Button variant="outline" onPress={() => refetch()}>
            <Text>Retry</Text>
          </Button>
        </View>
      ) : (
        <FlatList
          data={beneficiaries}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          ListEmptyComponent={
            <View className="items-center justify-center py-12">
              <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Text className="text-3xl">👥</Text>
              </View>
              <Text className="mb-2 text-lg font-semibold text-foreground">No Beneficiaries</Text>
              <Text className="mb-6 max-w-[250px] text-center text-muted-foreground">
                You haven&apos;t added anyone yet. Add a beneficiary to start sending money.
              </Text>
              <Button onPress={handleAddBeneficiary}>
                <Text className="font-medium text-white">Add First Beneficiary</Text>
              </Button>
            </View>
          }
        />
      )}

      {/* Floating Action Button */}
      {beneficiaries.length > 0 && (
        <View className="absolute bottom-6 right-6">
          <Button
            onPress={handleAddBeneficiary}
            className="h-14 rounded-full px-6 shadow-lg shadow-black/20">
            <Text className="mr-2 text-lg font-bold text-white">+</Text>
            <Text className="font-semibold text-white">Add New</Text>
          </Button>
        </View>
      )}
    </View>
  );
}
