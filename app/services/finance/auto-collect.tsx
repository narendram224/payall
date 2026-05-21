import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import UPIInput from '@/components/forms/UPIInput';
import FrequencySelector from '@/components/forms/FrequencySelector';
import  TransactionSummary  from '@/components/shared/TransactionSummary';
import SuccessScreen from '@/components/recharge/SuccessScreen';
import LoadingOverlay from '@/components/shared/LoadingOverlay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AutoCollect = () => {
  const [step, setStep] = useState<'upi' | 'rules' | 'summary' | 'success'>('upi');
  const [upiId, setUpiId] = useState('');
  const [frequency, setFrequency] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactionResult, setTransactionResult] = useState<any>(null);

  const frequencies = [
    { id: '1', label: 'Daily', value: 'daily', description: 'Collect amount daily' },
    { id: '2', label: 'Weekly', value: 'weekly', description: 'Collect amount every week' },
    { id: '3', label: 'Monthly', value: 'monthly', description: 'Collect amount every month' },
  ];

  const handleUPIVerification = async () => {
    if (!upiId || !upiId.includes('@')) { Alert.alert('Error', 'Please enter a valid UPI ID'); return; }
    setLoading(true);
    setStep('rules');
    setLoading(false);
  };

  const handleSetupRules = async () => {
    if (!frequency) { Alert.alert('Error', 'Please select a frequency'); return; }
    if (!amount || parseFloat(amount) <= 0) { Alert.alert('Error', 'Please enter a valid amount'); return; }
    setStep('summary');
  };

  const handleActivate = async () => {
    setLoading(true);
    setTransactionResult({
      orderId: 'AC' + Date.now(),
      amount,
      status: 'success',
    });
    setStep('success');
    setLoading(false);
  };

  const handleBack = () => {
    if (step === 'summary') setStep('rules');
    if (step === 'rules') setStep('upi');
    if (step === 'success') setStep('upi');
  };

  const handleSuccessComplete = () => {
    setStep('upi');
    setTransactionResult(null);
    setUpiId('');
    setFrequency(null);
    setAmount('');
    setDescription('');
    router.back();
  };

  const activeStepIndex = step === 'upi' ? 0 : step === 'rules' ? 1 : 2;

  if (step === 'success') {
    return (
      <SuccessScreen
        orderId={transactionResult?.orderId}
        amount={transactionResult?.amount}
        message="Your auto collect setup was successful"
        onDone={handleSuccessComplete}
      />
    );
  }

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 }}>
      <View className="mb-2">
        <Text className="text-xs font-medium text-muted-foreground tracking-wider uppercase">AUTO COLLECT</Text>
      </View>

      {/* Step Indicator */}
      <View className="flex-row justify-between mb-6 mt-2">
        {[0, 1, 2].map((idx) => (
          <View key={idx} className="flex-1 mx-0.5 h-1.5 rounded-full bg-muted overflow-hidden">
            <View
              className="h-full rounded-full bg-primary"
              style={{ width: idx <= activeStepIndex ? '100%' : '0%' }}
            />
          </View>
        ))}
      </View>

      {step === 'upi' && (
        <View className="space-y-6">
          <Text className="text-lg font-semibold text-foreground mb-1">Step 1: Link UPI ID</Text>
          <UPIInput
            value={upiId}
            onChange={setUpiId}
            placeholder="Enter your UPI ID (e.g., name@upi)"
            className="mb-4"
          />
          <Button onPress={handleUPIVerification} className="w-full">
            <Text className="font-semibold text-primary-foreground">Verify UPI</Text>
          </Button>
        </View>
      )}

      {step === 'rules' && (
        <View className="space-y-6">
          <Text className="text-lg font-semibold text-foreground mb-1">Step 2: Set Auto Collect Rules</Text>
          <FrequencySelector
            frequencies={frequencies}
            selectedFrequency={frequency}
            onSelectFrequency={setFrequency}
            className="mb-4"
          />
          <View className="space-y-4">
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Amount (₹)</Text>
              <Input
                placeholder="Enter amount to collect"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                className="text-xl font-bold text-center h-14"
              />
            </View>
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Description (Optional)</Text>
              <Input
                placeholder="Add a description for this auto collect"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                className="h-24"
              />
            </View>
          </View>
          <Button onPress={handleSetupRules} className="w-full mt-2">
            <Text className="font-semibold text-primary-foreground">Review Setup</Text>
          </Button>
          <Button onPress={handleBack} variant="outline" className="w-full">
            <Text className="font-semibold text-foreground">Back</Text>
          </Button>
        </View>
      )}

      {step === 'summary' && (
        <View className="space-y-6">
          <Text className="text-lg font-semibold text-foreground mb-1">Step 3: Review & Activate</Text>
          <View className="bg-card rounded-xl p-4 border border-border">
            <View className="flex-row justify-between mb-3">
              <Text className="text-sm text-muted-foreground">UPI ID</Text>
              <Text className="text-base font-semibold text-foreground">{upiId}</Text>
            </View>
            <View className="flex-row justify-between mb-3">
              <Text className="text-sm text-muted-foreground">Frequency</Text>
              <Text className="text-base font-semibold text-foreground">{frequency?.label}</Text>
            </View>
            <View className="flex-row justify-between mb-3">
              <Text className="text-sm text-muted-foreground">Amount</Text>
              <Text className="text-base font-semibold text-foreground">₹{amount}</Text>
            </View>
            {description && (
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted-foreground">Description</Text>
                <Text className="text-base font-semibold text-foreground">{description}</Text>
              </View>
            )}
          </View>

          <TransactionSummary
            transactionType="Auto Collect"
            recipientName="Self"
            accountNumber={upiId}
            bankName="UPI"
            amount={parseFloat(amount) || 0}
            className="mb-2"
          />

          <View className="flex-row gap-3 mt-2">
            <Button onPress={handleBack} variant="outline" className="flex-1">
              <Text className="font-semibold text-foreground">Back</Text>
            </Button>
            <Button onPress={handleActivate} className="flex-1">
              <Text className="font-semibold text-primary-foreground">Activate</Text>
            </Button>
          </View>
        </View>
      )}

      <LoadingOverlay visible={loading} message="Processing..." />
    </ScrollView>
  );
};

export default AutoCollect;
