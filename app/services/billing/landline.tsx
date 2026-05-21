import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
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

  const circles = [
    { id: '1', name: 'Delhi', code: '011' },
    { id: '2', name: 'Mumbai', code: '022' },
    { id: '3', name: 'Kolkata', code: '033' },
    { id: '4', name: 'Chennai', code: '044' },
    { id: '5', name: 'Bangalore', code: '080' },
  ];
  const [selectedCircle, setSelectedCircle] = useState(circles[0]);

  useEffect(() => { loadProviders(); }, []);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const data = await rechargeService.getProviders();
      const landlineProviders = data.providers.filter(
        (p: Provider) => p.service_id === 4 && p.active === 1,
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
    if (!selectedOperator) { Alert.alert('Error', 'Please select an operator'); return; }
    if (!stdCode) { Alert.alert('Error', 'Please enter STD code'); return; }
    if (!landlineNumber || landlineNumber.length < 6) { Alert.alert('Error', 'Please enter a valid landline number'); return; }
    try {
      setLoading(true);
      setBillDetails({
        billerName: selectedOperator.provider_name,
        consumerNumber: `${stdCode}-${landlineNumber}`,
        consumerName: 'John Doe',
        amount: 800,
        dueDate: '2024-12-31',
        billDate: '2024-12-01',
      });
      setShowSummary(true);
    } catch {
      Alert.alert('Error', 'Failed to fetch bill details');
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = () => {
    if (!selectedOperator) { Alert.alert('Error', 'Please select an operator'); return; }
    if (!stdCode) { Alert.alert('Error', 'Please enter STD code'); return; }
    if (!landlineNumber || landlineNumber.length < 6) { Alert.alert('Error', 'Please enter a valid landline number'); return; }
    if (!amount || parseFloat(amount) <= 0) { Alert.alert('Error', 'Please enter a valid amount'); return; }
    handleFetchBill();
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setTransactionResult({
        orderId: 'TXN' + Date.now(),
        amount,
        status: 'success',
      });
      setShowSuccess(true);
    } catch {
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
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 }}>
      <View className="mb-2">
        <Text className="text-xs font-medium text-muted-foreground tracking-wider uppercase">SELECT OPERATOR</Text>
      </View>

      <View className="space-y-6">
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
          className="mt-2"
        />

        <AmountInput value={amount} onChangeText={setAmount} className="mt-2" />

        {!showSummary && (
          <Button onPress={handleProceed} className="mt-2">
            <Text className="font-semibold text-white">Fetch Bill</Text>
          </Button>
        )}

        {showSummary && billDetails && (
          <View className="space-y-4">
            <BillDetailsCard
              billerName={billDetails.billerName}
              consumerNumber={billDetails.consumerNumber}
              consumerName={billDetails.consumerName}
              amount={billDetails.amount}
              dueDate={billDetails.dueDate}
              billDate={billDetails.billDate}
              className="mt-2"
            />

            <PaymentSummary
              serviceName="Landline"
              billerName={billDetails.billerName}
              consumerNumber={billDetails.consumerNumber}
              amount={billDetails.amount}
              className="mt-2"
            />

            <View className="flex-row gap-3 mt-2">
              <Button onPress={handleBack} variant="outline" className="flex-1">
                <Text className="font-semibold">Back</Text>
              </Button>
              <Button onPress={handlePayment} className="flex-1">
                <Text className="font-semibold text-white">Pay Now</Text>
              </Button>
            </View>
          </View>
        )}
      </View>

      <LoadingOverlay visible={loading && providers.length > 0} message="Processing..." />
    </ScrollView>
  );
};

export default Landline;
