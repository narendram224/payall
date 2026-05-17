import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import OperatorSelector from '@/components/recharge/OperatorSelector';
import NumberInput from '@/components/recharge/NumberInput';
import AmountInput from '@/components/recharge/AmountInput';
import TransactionSummary from '@/components/recharge/TransactionSummary';
import SuccessScreen from '@/components/recharge/SuccessScreen';
import { Button } from '@/components/ui/button';
import { rechargeService, Provider } from '@/api/recharge';

const DTHRecharge = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<Provider | null>(null);
  const [customerId, setCustomerId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionResult, setTransactionResult] = useState<any>(null);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const data = await rechargeService.getProviders();

      // Filter for DTH providers (service_id === 2 for DTH)
      const dthProviders = data.providers.filter(
        (p: Provider) => p.service_id === 2 && p.active === 1
      );
      setProviders(dthProviders);
    } catch (error) {
      console.error('Error loading providers:', error);
      Alert.alert('Error', 'Failed to load operators');
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = () => {
    if (!selectedOperator) {
      Alert.alert('Error', 'Please select an operator');
      return;
    }
    if (!customerId || customerId.length < 5) {
      Alert.alert('Error', 'Please enter a valid customer ID');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    setShowSummary(true);
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const clientId = `RC${Date.now()}`;

      const response = await rechargeService.recharge({
        number: customerId,
        provider_id: selectedOperator?.id || 0,
        amount: amount,
        client_id: clientId,
        optional1: customerId, // Using customer ID as optional field for DTH
      });

      if (response.status_id === 1) {
        setTransactionResult(response);
        setShowSummary(false);
        setShowSuccess(true);
      } else {
        Alert.alert('Transaction Failed', response.message || 'Please try again');
      }
    } catch (error) {
      console.error('Recharge error:', error);
      Alert.alert('Error', 'Transaction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    setShowSuccess(false);
    setCustomerId('');
    setAmount('');
    setSelectedOperator(null);
    router.back();
  };

  if (loading && providers.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-muted-foreground">Loading operators...</Text>
      </View>
    );
  }

  if (showSuccess && transactionResult) {
    return (
      <SuccessScreen
        orderId={transactionResult.order_id}
        amount={transactionResult.amount}
        message={transactionResult.message}
        onDone={handleDone}
      />
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        <Text className="mb-6 text-2xl font-bold text-foreground">DTH Recharge</Text>

        {!showSummary ? (
          <View className="space-y-6">
            <OperatorSelector
              operators={providers}
              selectedOperator={selectedOperator}
              onSelectOperator={setSelectedOperator}
            />

            <NumberInput
              label="Customer ID"
              placeholder="Enter your DTH customer ID"
              value={customerId}
              onChangeText={setCustomerId}
              maxLength={15}
              keyboardType="numeric"
            />

            <AmountInput
              value={amount}
              onChangeText={setAmount}
              quickAmounts={[100, 200, 300, 500, 1000]}
            />

            <Button onPress={handleProceed} disabled={loading} className="w-full">
              <Text className="font-semibold text-primary-foreground">
                {loading ? 'Processing...' : 'Proceed'}
              </Text>
            </Button>
          </View>
        ) : (
          <View className="space-y-6">
            <TransactionSummary
              operatorName={selectedOperator?.provider_name || ''}
              number={customerId}
              amount={amount}
            />

            <View className="flex-row gap-3">
              <Button onPress={() => setShowSummary(false)} variant="outline" className="flex-1">
                <Text className="font-semibold text-foreground">Back</Text>
              </Button>
              <Button onPress={handleConfirm} disabled={loading} className="flex-1">
                <Text className="font-semibold text-primary-foreground">
                  {loading ? 'Processing...' : 'Confirm'}
                </Text>
              </Button>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default DTHRecharge;
