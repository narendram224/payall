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

const MobileRecharge = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<Provider | null>(null);
  const [mobileNumber, setMobileNumber] = useState('');
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
      const mobileProviders = data.providers.filter(
        (p: Provider) => p.service_id === 1 && p.active === 1,
      );
      setProviders(mobileProviders);
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
    if (!mobileNumber || mobileNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid mobile number');
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
        number: mobileNumber,
        provider_id: selectedOperator?.id || 0,
        amount,
        client_id: clientId,
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
    setMobileNumber('');
    setAmount('');
    setSelectedOperator(null);
    router.back();
  };

  if (loading && providers.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
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
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 }}>
      <View className="mb-2">
        <Text className="text-xs font-medium text-muted-foreground tracking-wider uppercase">SELECT OPERATOR</Text>
      </View>

      {!showSummary ? (
        <View className="space-y-6">
          <OperatorSelector
            operators={providers}
            selectedOperator={selectedOperator}
            onSelectOperator={setSelectedOperator}
          />

          <NumberInput
            label="Mobile Number"
            placeholder="Enter 10-digit mobile number"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            maxLength={10}
            keyboardType="phone-pad"
          />

          <AmountInput
            value={amount}
            onChangeText={setAmount}
            quickAmounts={[10, 20, 50, 100, 200, 500, 1000]}
          />

          <Button onPress={handleProceed} disabled={loading} className="w-full mt-2">
            <Text className="font-semibold text-primary-foreground">
              {loading ? 'Processing...' : 'Proceed'}
            </Text>
          </Button>
        </View>
      ) : (
        <View className="space-y-6">
          <TransactionSummary
            operatorName={selectedOperator?.provider_name || ''}
            number={mobileNumber}
            amount={amount}
          />

          <View className="flex-row gap-3 mt-2">
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
    </ScrollView>
  );
};

export default MobileRecharge;
