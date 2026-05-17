import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import AadhaarInput from '@/components/forms/AadhaarInput';
import BankDetailsInput from '@/components/forms/BankDetailsInput';
import TransactionSummary from '@/components/shared/TransactionSummary';
import SuccessScreen from '@/components/recharge/SuccessScreen';
import LoadingOverlay from '@/components/shared/LoadingOverlay';
import { Button } from '@/components/ui/button';
import AmountInput from '@/components/recharge/AmountInput';

const DMT = () => {
  const [step, setStep] = useState<'verification' | 'beneficiary' | 'transfer' | 'success'>(
    'verification'
  );
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactionResult, setTransactionResult] = useState<any>(null);

  const handleAadhaarVerification = async () => {
    if (!aadhaarNumber || aadhaarNumber.length !== 12) {
      Alert.alert('Error', 'Please enter a valid 12-digit Aadhaar number');
      return;
    }

    try {
      setLoading(true);
      // TODO: Call API to verify Aadhaar and send OTP
      // await dmtService.verifyAadhaar({ aadhaar_number: aadhaarNumber });

      // Move to beneficiary step
      setStep('beneficiary');
    } catch (error) {
      console.error('Error verifying Aadhaar:', error);
      Alert.alert('Error', 'Aadhaar verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBeneficiary = async () => {
    if (!accountNumber || accountNumber.length < 9) {
      Alert.alert('Error', 'Please enter a valid account number');
      return;
    }
    if (!ifscCode || ifscCode.length !== 11) {
      Alert.alert('Error', 'Please enter a valid IFSC code');
      return;
    }
    if (!accountHolderName || accountHolderName.length < 3) {
      Alert.alert('Error', 'Please enter account holder name');
      return;
    }

    try {
      setLoading(true);
      // TODO: Call API to add beneficiary
      // await dmtService.addBeneficiary({
      //   account_number: accountNumber,
      //   ifsc_code: ifscCode,
      //   account_holder_name: accountHolderName,
      // });

      // Move to transfer step
      setStep('transfer');
    } catch (error) {
      console.error('Error adding beneficiary:', error);
      Alert.alert('Error', 'Failed to add beneficiary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      // TODO: Call API to process transfer
      // const result = await dmtService.transfer({
      //   account_number: accountNumber,
      //   ifsc_code: ifscCode,
      //   amount: parseFloat(amount),
      // });

      setTransactionResult({
        orderId: 'DMT' + Date.now(),
        amount: amount,
        status: 'success',
      });
      setStep('success');
    } catch (error) {
      console.error('Error processing transfer:', error);
      Alert.alert('Error', 'Transfer failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessComplete = () => {
    setStep('verification');
    setTransactionResult(null);
    setAadhaarNumber('');
    setOtp('');
    setAccountNumber('');
    setIfscCode('');
    setAccountHolderName('');
    setAmount('');
    router.back();
  };

  const handleBack = () => {
    if (step === 'transfer') {
      setStep('beneficiary');
    } else if (step === 'beneficiary') {
      setStep('verification');
    } else if (step === 'success') {
      setStep('verification');
    }
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

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <Text className="mb-6 text-2xl font-bold text-gray-800">Domestic Money Transfer (DMT)</Text>

        {/* Step Indicator */}
        <View className="mb-6 flex-row justify-between">
          <View className="h-1 flex-1 rounded bg-gray-300">
            <View
              className={`h-full rounded ${step === 'verification' ? 'w-1/4 bg-primary' : step === 'beneficiary' ? 'w-2/4 bg-primary' : step === 'transfer' ? 'w-3/4 bg-primary' : step === 'success' ? 'bg-primary' : 'bg-gray-300'}`}
            />
          </View>
          <View className="h-1 flex-1 rounded bg-gray-300">
            <View
              className={`h-full rounded ${step === 'beneficiary' ? 'w-1/2 bg-primary' : step === 'transfer' ? 'w-full bg-primary' : 'bg-gray-300'}`}
            />
          </View>
          <View className="h-1 flex-1 rounded bg-gray-300">
            <View
              className={`h-full rounded ${step === 'transfer' ? 'w-full bg-primary' : 'bg-gray-300'}`}
            />
          </View>
        </View>

        {step === 'verification' && (
          <>
            <Text className="mb-4 text-lg font-semibold text-gray-800">
              Step 1: Sender Verification
            </Text>
            <AadhaarInput value={aadhaarNumber} onChange={setAadhaarNumber} className="mb-4" />
            <Button onPress={handleAadhaarVerification} className="mt-4">
              <Text className="font-semibold text-white">Verify Aadhaar</Text>
            </Button>
          </>
        )}

        {step === 'beneficiary' && (
          <>
            <Text className="mb-4 text-lg font-semibold text-gray-800">
              Step 2: Add Beneficiary
            </Text>
            <BankDetailsInput
              accountNumber={accountNumber}
              setAccountNumber={setAccountNumber}
              ifscCode={ifscCode}
              setIfscCode={setIfscCode}
              accountHolderName={accountHolderName}
              setAccountHolderName={setAccountHolderName}
              className="mb-4"
            />
            <Button onPress={handleAddBeneficiary} className="mt-4">
              <Text className="font-semibold text-white">Add Beneficiary</Text>
            </Button>
            <Button onPress={handleBack} variant="outline" className="mt-2">
              <Text className="font-semibold">Back</Text>
            </Button>
          </>
        )}

        {step === 'transfer' && (
          <>
            <Text className="mb-4 text-lg font-semibold text-gray-800">Step 3: Transfer Money</Text>
            <View className="mb-4 rounded-xl bg-white p-4">
              <Text className="mb-2 text-sm text-gray-600">Account Number</Text>
              <Text className="text-base font-semibold">{accountNumber}</Text>
              <Text className="mb-2 mt-4 text-sm text-gray-600">IFSC Code</Text>
              <Text className="text-base font-semibold">{ifscCode}</Text>
              <Text className="mb-2 mt-4 text-sm text-gray-600">Account Holder</Text>
              <Text className="text-base font-semibold">{accountHolderName}</Text>
            </View>

            <AmountInput
              value={amount}
              onChangeText={setAmount}
              quickAmounts={[500, 1000, 2000, 5000, 10000]}
              className="mb-4"
            />

            <TransactionSummary
              transactionType="Money Transfer"
              recipientName={accountHolderName}
              accountNumber={accountNumber}
              bankName="Bank"
              amount={parseFloat(amount) || 0}
              className="mb-4"
            />

            <Button onPress={handleTransfer} className="mt-4">
              <Text className="font-semibold text-white">Transfer Now</Text>
            </Button>
            <Button onPress={handleBack} variant="outline" className="mt-2">
              <Text className="font-semibold">Back</Text>
            </Button>
          </>
        )}
      </View>

      <LoadingOverlay visible={loading} message="Processing..." />
    </ScrollView>
  );
};

export default DMT;
