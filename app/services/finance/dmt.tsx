import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import AadhaarInput from '@/components/forms/AadhaarInput';
import BankDetailsInput from '@/components/forms/BankDetailsInput';
import SuccessScreen from '@/components/recharge/SuccessScreen';
import LoadingOverlay from '@/components/shared/LoadingOverlay';
import { Button } from '@/components/ui/button';
import AmountInput from '@/components/recharge/AmountInput';

const DMT = () => {
  const [step, setStep] = useState<'verification' | 'beneficiary' | 'transfer' | 'success'>('verification');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactionResult, setTransactionResult] = useState<any>(null);

  const handleAadhaarVerification = async () => {
    if (!aadhaarNumber || aadhaarNumber.length !== 12) { Alert.alert('Error', 'Please enter a valid 12-digit Aadhaar number'); return; }
    try {
      setLoading(true);
      setStep('beneficiary');
    } catch {
      Alert.alert('Error', 'Aadhaar verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBeneficiary = async () => {
    if (!accountNumber || accountNumber.length < 9) { Alert.alert('Error', 'Please enter a valid account number'); return; }
    if (!ifscCode || ifscCode.length !== 11) { Alert.alert('Error', 'Please enter a valid IFSC code'); return; }
    if (!accountHolderName || accountHolderName.length < 3) { Alert.alert('Error', 'Please enter account holder name'); return; }
    try {
      setLoading(true);
      setStep('transfer');
    } catch {
      Alert.alert('Error', 'Failed to add beneficiary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!amount || parseFloat(amount) <= 0) { Alert.alert('Error', 'Please enter a valid amount'); return; }
    try {
      setLoading(true);
      setTransactionResult({ orderId: 'DMT' + Date.now(), amount, status: 'success' });
      setStep('success');
    } catch {
      Alert.alert('Error', 'Transfer failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessComplete = () => {
    setStep('verification');
    setTransactionResult(null);
    setAadhaarNumber('');
    setAccountNumber('');
    setIfscCode('');
    setAccountHolderName('');
    setAmount('');
    router.back();
  };

  const handleBack = () => {
    if (step === 'transfer') setStep('beneficiary');
    if (step === 'beneficiary') setStep('verification');
    if (step === 'success') setStep('verification');
  };

  if (step === 'success') {
    return (
      <SuccessScreen
        orderId={transactionResult?.orderId}
        amount={transactionResult?.amount}
        message="Your money transfer was successful"
        onDone={handleSuccessComplete}
      />
    );
  }

  const activeStepIndex = step === 'verification' ? 0 : step === 'beneficiary' ? 1 : 2;

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 }}>
      <View className="mb-2">
        <Text className="text-xs font-medium text-muted-foreground tracking-wider uppercase">DOMESTIC MONEY TRANSFER</Text>
      </View>

       {/* Step Indicator */}
      <View className="mb-6 flex-row justify-between mt-2">
        {[0, 1, 2].map((idx) => (
          <View key={idx} className="flex-1 mx-0.5 h-1.5 rounded-full bg-muted overflow-hidden">
            <View
              className="h-full rounded-full bg-primary"
              style={{ width: idx <= activeStepIndex ? '100%' : '0%' }}
            />
          </View>
        ))}
      </View>

      {step === 'verification' && (
        <View className="space-y-6">
          <Text className="text-lg font-semibold text-foreground">Step 1: Sender Verification</Text>
          <AadhaarInput value={aadhaarNumber} onChange={setAadhaarNumber} className="mb-4" />
          <Button onPress={handleAadhaarVerification} className="w-full mt-2">
            <Text className="font-semibold text-primary-foreground">Verify Aadhaar</Text>
          </Button>
        </View>
      )}

      {step === 'beneficiary' && (
        <View className="space-y-6">
          <Text className="text-lg font-semibold text-foreground">Step 2: Add Beneficiary</Text>
          <BankDetailsInput
            accountNumber={accountNumber}
            setAccountNumber={setAccountNumber}
            ifscCode={ifscCode}
            setIfscCode={setIfscCode}
            accountHolderName={accountHolderName}
            setAccountHolderName={setAccountHolderName}
            className="mb-4"
          />
          <Button onPress={handleAddBeneficiary} className="w-full mt-2">
            <Text className="font-semibold text-primary-foreground">Add Beneficiary</Text>
          </Button>
          <Button onPress={handleBack} variant="outline" className="w-full">
            <Text className="font-semibold text-foreground">Back</Text>
          </Button>
        </View>
      )}

      {step === 'transfer' && (
        <View className="space-y-6">
          <Text className="text-lg font-semibold text-foreground">Step 3: Transfer Money</Text>
          <View className="bg-card rounded-xl p-4 border border-border">
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-muted-foreground">Account Number</Text>
              <Text className="text-sm font-semibold text-foreground">{accountNumber}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-muted-foreground">IFSC Code</Text>
              <Text className="text-sm font-semibold text-foreground">{ifscCode}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted-foreground">Account Holder</Text>
              <Text className="text-sm font-semibold text-foreground">{accountHolderName}</Text>
            </View>
          </View>

          <AmountInput
            value={amount}
            onChangeText={setAmount}
            quickAmounts={[500, 1000, 2000, 5000, 10000]}
            className="mb-4"
          />

          <Button onPress={handleTransfer} className="w-full mt-2">
            <Text className="font-semibold text-primary-foreground">Transfer Now</Text>
          </Button>
          <Button onPress={handleBack} variant="outline" className="w-full">
            <Text className="font-semibold text-foreground">Back</Text>
          </Button>
        </View>
      )}

      <LoadingOverlay visible={loading} message="Processing..." />
    </ScrollView>
  );
};

export default DMT;
