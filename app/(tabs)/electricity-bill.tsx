import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import OperatorSelector from '@/components/recharge/OperatorSelector';
import NumberInput from '@/components/recharge/NumberInput';
import AmountInput from '@/components/recharge/AmountInput';
import TransactionSummary from '@/components/recharge/TransactionSummary';
import SuccessScreen from '@/components/recharge/SuccessScreen';
import { Button } from '@/components/ui/button';
import { rechargeService } from '@/api/recharge';

interface Operator {
  id: number;
  name: string;
  logo: string;
  slug: string;
}

const ElectricityBillPayment = () => {
  const [providers, setProviders] = useState<Operator[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
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
      // Filter for electricity providers only (adjust based on your API response)
      const electricityProviders = data.filter((p: any) => p.category === 'electricity' || p.service_id === 3); // Assuming service_id 3 for electricity
      setProviders(electricityProviders);
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
      const clientId = `EB${Date.now()}`;

      const response = await rechargeService.recharge({
        number: customerId,
        provider_id: selectedOperator?.id || 0,
        amount: amount,
        client_id: clientId,
        optional1: customerId, // Using customer ID as optional field for electricity
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
      <View className="p-6">
        {/* Stunning Header with Gradient */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-foreground bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Electricity Bill Payment
          </Text>
          <Text className="mt-2 text-muted-foreground text-sm">
            Pay your electricity bill quickly and securely
          </Text>
        </View>

        {!showSummary ? (
          <View className="space-y-8">
            {/* Operator Selector with Card */}
            <View className="bg-card rounded-lg p-4 shadow-sm">
              <OperatorSelector
                operators={providers}
                selectedOperator={selectedOperator}
                onSelectOperator={setSelectedOperator}
              />
            </View>

            {/* Customer ID Input */}
            <NumberInput
              label="Consumer Number"
              placeholder="Enter your electricity consumer number"
              value={customerId}
              onChangeText={setCustomerId}
              maxLength={15}
              keyboardType="numeric"
            />

            {/* Amount Input */}
            <AmountInput
              value={amount}
              onChangeText={setAmount}
              quickAmounts={[500, 1000, 1500, 2000, 5000]}
            />

            {/* Proceed Button with Gradient */}
            <Button onPress={handleProceed} disabled={loading} className="w-full bg-gradient-to-r from-primary to-secondary">
              <Text className="font-semibold text-primary-foreground">
                {loading ? 'Processing...' : 'Proceed to Pay'}
              </Text>
            </Button>
          </View>
        ) : (
          <View className="space-y-8">
            {/* Transaction Summary */}
            <View className="bg-card rounded-lg p-6 shadow-md">
              <TransactionSummary
                operatorName={selectedOperator?.name || ''}
                number={customerId}
                amount={amount}
              />
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-4">
              <Button
                onPress={() => setShowSummary(false)}
                variant="outline"
                className="flex-1 bg-muted-foreground/10"
              >
                <Text className="font-semibold text-foreground">Back</Text>
              </Button>
              <Button
                onPress={handleConfirm}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-primary to-secondary"
              >
                <Text className="font-semibold text-primary-foreground">
                  {loading ? 'Processing...' : 'Confirm Payment'}
                </Text>
              </Button>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ElectricityBillPayment;