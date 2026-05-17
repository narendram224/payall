import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import UPIInput from '@/components/forms/UPIInput';
import FrequencySelector from '@/components/forms/FrequencySelector';
import TransactionSummary from '@/components/shared/TransactionSummary';
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
    {
      id: '1',
      label: 'Daily',
      value: 'daily',
      description: 'Collect amount daily',
    },
    {
      id: '2',
      label: 'Weekly',
      value: 'weekly',
      description: 'Collect amount every week',
    },
    {
      id: '3',
      label: 'Monthly',
      value: 'monthly',
      description: 'Collect amount every month',
    },
  ];

  const handleUPIVerification = async () => {
    if (!upiId || !upiId.includes('@')) {
      Alert.alert('Error', 'Please enter a valid UPI ID');
      return;
    }

    try {
      setLoading(true);
      // TODO: Call API to verify UPI
      // await autoCollectService.verifyUPI({ upi_id: upiId });
      
      setStep('rules');
    } catch (error) {
      console.error('Error verifying UPI:', error);
      Alert.alert('Error', 'UPI verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetupRules = async () => {
    if (!frequency) {
      Alert.alert('Error', 'Please select a frequency');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setStep('summary');
  };

  const handleActivate = async () => {
    try {
      setLoading(true);
      // TODO: Call API to activate auto collect
      // await autoCollectService.activate({
      //   upi_id: upiId,
      //   frequency: frequency.value,
      //   amount: parseFloat(amount),
      //   description,
      // });
      
      setTransactionResult({
        orderId: 'AC' + Date.now(),
        amount: amount,
        status: 'success',
      });
      setStep('success');
    } catch (error) {
      console.error('Error activating auto collect:', error);
      Alert.alert('Error', 'Auto collect activation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'rules') {
      setStep('upi');
    } else if (step === 'summary') {
      setStep('rules');
    } else if (step === 'success') {
      setStep('upi');
    }
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
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-800 mb-6">Auto Collect</Text>

        {/* Step Indicator */}
        <View className="flex-row justify-between mb-6">
          <View className="flex-1 h-1 bg-gray-300 rounded">
            <View className={`h-full rounded ${step === 'upi' ? 'bg-primary w-1/4' : step === 'rules' ? 'bg-primary w-2/4' : step === 'summary' ? 'bg-primary w-3/4' : step === 'success' ? 'bg-primary' : 'bg-gray-300'}`} />
          </View>
          <View className="flex-1 h-1 bg-gray-300 rounded">
            <View className={`h-full rounded ${step === 'rules' ? 'bg-primary w-1/2' : step === 'summary' ? 'bg-primary w-full' : 'bg-gray-300'}`} />
          </View>
          <View className="flex-1 h-1 bg-gray-300 rounded">
            <View className={`h-full rounded ${step === 'summary' ? 'bg-primary w-full' : 'bg-gray-300'}`} />
          </View>
        </View>

        {step === 'upi' && (
          <>
            <Text className="text-lg font-semibold text-gray-800 mb-4">Step 1: Link UPI ID</Text>
            <UPIInput
              value={upiId}
              onChange={setUpiId}
              placeholder="Enter your UPI ID (e.g., name@upi)"
              className="mb-4"
            />
            <Button onPress={handleUPIVerification} className="mt-4">
              <Text className="font-semibold text-white">Verify UPI</Text>
            </Button>
          </>
        )}

        {step === 'rules' && (
          <>
            <Text className="text-lg font-semibold text-gray-800 mb-4">Step 2: Set Auto Collect Rules</Text>
            <FrequencySelector
              frequencies={frequencies}
              selectedFrequency={frequency}
              onSelectFrequency={setFrequency}
              className="mb-4"
            />
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Amount (₹)</Text>
              <Input
                placeholder="Enter amount to collect"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                className="text-xl font-bold text-center h-14"
              />
            </View>
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Description (Optional)</Text>
              <Input
                placeholder="Add a description for this auto collect"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                className="h-24"
              />
            </View>
            <Button onPress={handleSetupRules} className="mt-4">
              <Text className="font-semibold text-white">Review Setup</Text>
            </Button>
            <Button onPress={handleBack} variant="outline" className="mt-2">
              <Text className="font-semibold">Back</Text>
            </Button>
          </>
        )}

        {step === 'summary' && (
          <>
            <Text className="text-lg font-semibold text-gray-800 mb-4">Step 3: Review & Activate</Text>
            <View className="bg-white rounded-xl p-4 mb-4">
              <Text className="text-sm text-gray-600 mb-2">UPI ID</Text>
              <Text className="text-base font-semibold">{upiId}</Text>
              <Text className="text-sm text-gray-600 mb-2 mt-4">Frequency</Text>
              <Text className="text-base font-semibold">{frequency?.label}</Text>
              <Text className="text-sm text-gray-600 mb-2 mt-4">Amount</Text>
              <Text className="text-base font-semibold">₹{amount}</Text>
              {description && (
                <>
                  <Text className="text-sm text-gray-600 mb-2 mt-4">Description</Text>
                  <Text className="text-base font-semibold">{description}</Text>
                </>
              )}
            </View>

            <TransactionSummary
              transactionType="Auto Collect"
              recipientName="Self"
              accountNumber={upiId}
              bankName="UPI"
              amount={parseFloat(amount) || 0}
              className="mb-4"
            />

            <View className="flex-row gap-3 mt-4">
              <Button onPress={handleBack} variant="outline" className="flex-1">
                <Text className="font-semibold">Back</Text>
              </Button>
              <Button onPress={handleActivate} className="flex-1">
                <Text className="font-semibold text-white">Activate</Text>
              </Button>
            </View>
          </>
        )}
      </View>

      <LoadingOverlay visible={loading} message="Processing..." />
    </ScrollView>
  );
};

export default AutoCollect;
