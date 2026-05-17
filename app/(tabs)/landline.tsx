import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import OperatorSelector from '@/components/recharge/OperatorSelector';
import LandlineInput from '@/components/forms/LandlineInput';
import BillDetailsCard from '@/components/shared/BillDetailsCard';
import PaymentSummary from '@/components/shared/PaymentSummary';
import SuccessScreen from '@/components/recharge/SuccessScreen';
import LoadingOverlay from '@/components/shared/LoadingOverlay';
import { Button } from '@/components/ui/button';
import { rechargeService, Provider } from '@/api/recharge';
import AmountInput from '@/components/recharge/AmountInput';

const Landline = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<Provider | null>(null);
  const [stdCode, setStdCode] = useState('');
  const [landlineNumber, setLandlineNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionResult, setTransactionResult] = useState<any>(null);
  const [billDetails, setBillDetails] = useState<any>(null);

  // Mock circles data
  const circles = [
    { id: '1', name: 'Delhi', code: '011' },
    { id: '2', name: 'Mumbai', code: '022' },
    { id: '3', name: 'Kolkata', code: '033' },
    { id: '4', name: 'Chennai', code: '044' },
    { id: '5', name: 'Bangalore', code: '080' },
  ];
  const [selectedCircle, setSelectedCircle] = useState(circles[0]);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const data = await rechargeService.getProviders();

      // Filter for landline providers (service_id === 4 for Landline)
      const landlineProviders = data.providers.filter(
        (p: Provider) => p.service_id === 4 && p.active === 1
      );
      setProviders(landlineProviders);
    } catch (error) {
      console.error('Error loading providers:', error);
      Alert.alert('Error', 'Failed to load operators');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchBill = async () => {
    if (!selectedOperator) {
      Alert.alert('Error', 'Please select an operator');
      return;
    }
    if (!stdCode) {
      Alert.alert('Error', 'Please enter STD code');
      return;
    }
    if (!landlineNumber || landlineNumber.length < 6) {
      Alert.alert('Error', 'Please enter a valid landline number');
      return;
    }

    try {
      setLoading(true);
      // TODO: Call API to fetch bill details
      // const billData = await rechargeService.fetchBill({
      //   provider_id: selectedOperator.id,
      //   std_code: stdCode,
      //   landline_number: landlineNumber,
      // });

      // Mock bill details for now
      setBillDetails({
        billerName: selectedOperator.provider_name,
        consumerNumber: `${stdCode}-${landlineNumber}`,
        consumerName: 'John Doe',
        amount: 800,
        dueDate: '2024-12-31',
        billDate: '2024-12-01',
      });
      setShowSummary(true);
    } catch (error) {
      console.error('Error fetching bill:', error);
      Alert.alert('Error', 'Failed to fetch bill details');
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = () => {
    if (!selectedOperator) {
      Alert.alert('Error', 'Please select an operator');
      return;
    }
    if (!stdCode) {
      Alert.alert('Error', 'Please enter STD code');
      return;
    }
    if (!landlineNumber || landlineNumber.length < 6) {
      Alert.alert('Error', 'Please enter a valid landline number');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    handleFetchBill();
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      // TODO: Call API to process payment
      // const result = await rechargeService.processPayment({
      //   provider_id: selectedOperator.id,
      //   std_code: stdCode,
      //   landline_number: landlineNumber,
      //   amount: parseFloat(amount),
      // });

      setTransactionResult({
        orderId: 'TXN' + Date.now(),
        amount: amount,
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

  const handleBack = () => {
    setShowSummary(false);
    setBillDetails(null);
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
        message="Your landline bill payment was successful"
        onDone={handleSuccessComplete}
      />
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <Text className="mb-6 text-2xl font-bold text-gray-800">Landline Bill Payment</Text>

        {loading && providers.length === 0 ? (
          <View className="items-center justify-center py-12">
            <ActivityIndicator size="large" color="#00B9F2" />
            <Text className="mt-2 text-gray-600">Loading operators...</Text>
          </View>
        ) : (
          <>
            <OperatorSelector
              operators={providers}
              selectedOperator={selectedOperator}
              onSelectOperator={setSelectedOperator}
            />

            <LandlineInput
              stdCode={stdCode}
              setStdCode={setStdCode}
              landlineNumber={landlineNumber}
              setLandlineNumber={setLandlineNumber}
              circles={circles}
              selectedCircle={selectedCircle}
              onSelectCircle={setSelectedCircle}
              className="mt-4"
            />

            <AmountInput value={amount} onChangeText={setAmount} className="mt-4" />

            {!showSummary && (
              <Button onPress={handleProceed} className="mt-4">
                <Text className="font-semibold text-white">Fetch Bill</Text>
              </Button>
            )}

            {showSummary && billDetails && (
              <>
                <BillDetailsCard
                  billerName={billDetails.billerName}
                  consumerNumber={billDetails.consumerNumber}
                  consumerName={billDetails.consumerName}
                  amount={billDetails.amount}
                  dueDate={billDetails.dueDate}
                  billDate={billDetails.billDate}
                  className="mt-4"
                />

                <PaymentSummary
                  serviceName="Landline"
                  billerName={billDetails.billerName}
                  consumerNumber={billDetails.consumerNumber}
                  amount={billDetails.amount}
                  className="mt-4"
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
          </>
        )}
      </View>

      <LoadingOverlay visible={loading} message="Processing..." />
    </ScrollView>
  );
};

export default Landline;
