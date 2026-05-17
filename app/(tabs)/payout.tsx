import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import BankDetailsInput from '@/components/forms/BankDetailsInput';
import PayoutMethodSelector from '@/components/selectors/PayoutMethodSelector';
import TransactionSummary from '@/components/shared/TransactionSummary';
import SuccessScreen from '@/components/recharge/SuccessScreen';
import LoadingOverlay from '@/components/shared/LoadingOverlay';
import { Button } from '@/components/ui/button';
import AmountInput from '@/components/recharge/AmountInput';

const Payout = () => {
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionResult, setTransactionResult] = useState<any>(null);

  const payoutMethods = [
    {
      id: '1',
      name: 'NEFT',
      code: 'NEFT',
      description: 'National Electronic Funds Transfer',
      processingTime: '1-2 hours',
    },
    {
      id: '2',
      name: 'IMPS',
      code: 'IMPS',
      description: 'Immediate Payment Service',
      processingTime: 'Instant',
    },
    {
      id: '3',
      name: 'RTGS',
      code: 'RTGS',
      description: 'Real Time Gross Settlement',
      processingTime: '30 minutes',
    },
  ];

  const handleProceed = () => {
    if (!selectedMethod) {
      Alert.alert('Error', 'Please select a payout method');
      return;
    }
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
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setShowSummary(true);
  };

  const handlePayout = async () => {
    try {
      setLoading(true);
      // TODO: Call API to process payout
      // const result = await payoutService.processPayout({
      //   method: selectedMethod.code,
      //   account_number: accountNumber,
      //   ifsc_code: ifscCode,
      //   account_holder_name: accountHolderName,
      //   amount: parseFloat(amount),
      // });

      setTransactionResult({
        orderId: 'PAYOUT' + Date.now(),
        amount: amount,
        status: 'success',
      });
      setShowSuccess(true);
    } catch (error) {
      console.error('Error processing payout:', error);
      Alert.alert('Error', 'Payout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setShowSummary(false);
  };

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    router.back();
  };

  if (showSuccess) {
    return (
      <SuccessScreen
        orderId={transactionResult?.orderId}
        amount={transactionResult?.amount}
        message="Your payout was successful"
        onDone={handleSuccessComplete}
      />
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <Text className="mb-6 text-2xl font-bold text-gray-800">Payout</Text>

        <PayoutMethodSelector
          methods={payoutMethods}
          selectedMethod={selectedMethod}
          onSelectMethod={setSelectedMethod}
          className="mb-4"
        />

        <BankDetailsInput
          accountNumber={accountNumber}
          setAccountNumber={setAccountNumber}
          ifscCode={ifscCode}
          setIfscCode={setIfscCode}
          accountHolderName={accountHolderName}
          setAccountHolderName={setAccountHolderName}
          className="mb-4"
        />

        <AmountInput
          value={amount}
          onChangeText={setAmount}
          quickAmounts={[1000, 2000, 5000, 10000, 25000, 50000]}
          className="mb-4"
        />

        {!showSummary && (
          <Button onPress={handleProceed} className="mt-4">
            <Text className="font-semibold text-white">Proceed</Text>
          </Button>
        )}

        {showSummary && (
          <>
            <TransactionSummary
              transactionType={`${selectedMethod?.name} Payout`}
              recipientName={accountHolderName}
              accountNumber={accountNumber}
              bankName="Bank"
              amount={parseFloat(amount) || 0}
              className="mb-4"
            />

            <View className="mt-4 flex-row gap-3">
              <Button onPress={handleBack} variant="outline" className="flex-1">
                <Text className="font-semibold">Back</Text>
              </Button>
              <Button onPress={handlePayout} className="flex-1">
                <Text className="font-semibold text-white">Process Payout</Text>
              </Button>
            </View>
          </>
        )}
      </View>

      <LoadingOverlay visible={loading} message="Processing..." />
    </ScrollView>
  );
};

export default Payout;
