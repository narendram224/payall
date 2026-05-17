import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import PaymentMethodSelector, { PaymentMethod } from '@/components/selectors/PaymentMethodSelector';
import BankDetailsInput from '@/components/forms/BankDetailsInput';
import TransactionSummary from '@/components/shared/TransactionSummary';
import SuccessScreen from '@/components/recharge/SuccessScreen';
import LoadingOverlay from '@/components/shared/LoadingOverlay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PaymentGateway = () => {
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [transactionResult, setTransactionResult] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    {
      id: '1',
      name: 'Net Banking',
      icon: '',
      type: 'netbanking',
    },
    {
      id: '2',
      name: 'Credit Card',
      icon: '',
      type: 'card',
    },
    {
      id: '3',
      name: 'Debit Card',
      icon: '',
      type: 'card',
    },
    {
      id: '4',
      name: 'UPI',
      icon: '',
      type: 'upi',
    },
    {
      id: '5',
      name: 'Wallet',
      icon: '',
      type: 'wallet',
    },
  ];

  const handleProceed = () => {
    if (!selectedMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    if (selectedMethod.type === 'card' || selectedMethod.type === 'wallet') {
      if (!accountNumber || accountNumber.length < 16) {
        Alert.alert('Error', 'Please enter a valid card number');
        return;
      }
      if (!expiryDate) {
        Alert.alert('Error', 'Please enter expiry date');
        return;
      }
      if (!cvv || cvv.length !== 3) {
        Alert.alert('Error', 'Please enter CVV');
        return;
      }
    }

    if (selectedMethod.type === 'netbanking' || selectedMethod.type === 'upi') {
      if (!accountNumber || accountNumber.length < 9) {
        Alert.alert('Error', 'Please enter valid account details');
        return;
      }
      if (!ifscCode || ifscCode.length !== 11) {
        Alert.alert('Error', 'Please enter valid IFSC code');
        return;
      }
    }

    setShowSummary(true);
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      // TODO: Call API to process payment
      // const result = await paymentGatewayService.processPayment({
      //   method: selectedMethod.type,
      //   account_number: accountNumber,
      //   ifsc_code: ifscCode,
      //   account_holder_name: accountHolderName,
      //   expiry_date: expiryDate,
      //   cvv: cvv,
      //   amount: calculateAmount(),
      // });

      setTransactionResult({
        orderId: 'PG' + Date.now(),
        amount: calculateAmount(),
        status: 'success',
      });
      setShowSuccess(true);
    } catch (error) {
      console.error('Error processing payment:', error);
      Alert.alert('Error', 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateAmount = () => {
    // Mock calculation
    return 1000;
  };

  const handleBack = () => {
    setShowSummary(false);
  };

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    setSelectedMethod(null);
    setAccountNumber('');
    setIfscCode('');
    setAccountHolderName('');
    setExpiryDate('');
    setCvv('');
    router.back();
  };

  if (showSuccess) {
    return (
      <SuccessScreen
        orderId={transactionResult?.orderId}
        amount={transactionResult?.amount}
        message="Your payment was successful"
        onDone={handleSuccessComplete}
      />
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <Text className="mb-6 text-2xl font-bold text-gray-800">Payment Gateway</Text>

        <PaymentMethodSelector
          methods={paymentMethods}
          selectedMethod={selectedMethod}
          onSelectMethod={setSelectedMethod}
          className="mb-4"
        />

        {selectedMethod?.type === 'card' || selectedMethod?.type === 'wallet' ? (
          <>
            <BankDetailsInput
              accountNumber={accountNumber}
              setAccountNumber={setAccountNumber}
              ifscCode={ifscCode}
              setIfscCode={setIfscCode}
              accountHolderName={accountHolderName}
              setAccountHolderName={setAccountHolderName}
              className="mb-4"
            />
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">Expiry Date</Text>
              <Input
                placeholder="MM/YY"
                value={expiryDate}
                onChangeText={setExpiryDate}
                className="mb-2"
              />
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">CVV</Text>
                <Input
                  placeholder="123"
                  value={cvv}
                  onChangeText={setCvv}
                  maxLength={3}
                  className="text-center"
                />
              </View>
            </View>
          </>
        ) : null}

        {selectedMethod?.type === 'netbanking' || selectedMethod?.type === 'upi' ? (
          <>
            <BankDetailsInput
              accountNumber={accountNumber}
              setAccountNumber={setAccountNumber}
              ifscCode={ifscCode}
              setIfscCode={setIfscCode}
              accountHolderName={accountHolderName}
              setAccountHolderName={setAccountHolderName}
              className="mb-4"
            />
          </>
        ) : null}

        {!showSummary && (
          <Button onPress={handleProceed} className="mt-4">
            <Text className="font-semibold text-white">Proceed</Text>
          </Button>
        )}

        {showSummary && (
          <>
            <TransactionSummary
              transactionType={`${selectedMethod?.name} Payment`}
              recipientName={accountHolderName}
              accountNumber={accountNumber}
              bankName={selectedMethod?.name}
              amount={calculateAmount()}
              className="mb-4"
            />

            <View className="mt-4 flex-row gap-3">
              <Button onPress={handleBack} variant="outline" className="flex-1">
                <Text className="font-semibold">Back</Text>
              </Button>
              <Button onPress={handlePayment} className="flex-1">
                <Text className="font-semibold text-white">Pay Now</Text>
              </Button>
            </View>
          </>
        )}
      </View>

      <LoadingOverlay visible={loading} message="Processing..." />
    </ScrollView>
  );
};

export default PaymentGateway;
