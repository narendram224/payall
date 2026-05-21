import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import OperatorSelector from '@/components/recharge/OperatorSelector';
import NumberInput from '@/components/recharge/NumberInput';
import AmountInput from '@/components/recharge/AmountInput';
import BillDetailsCard from '@/components/shared/BillDetailsCard';
import PaymentSummary from '@/components/shared/PaymentSummary';
import SuccessScreen from '@/components/recharge/SuccessScreen';
import LoadingOverlay from '@/components/shared/LoadingOverlay';
import { Button } from '@/components/ui/button';
import { rechargeService, Provider } from '@/services/recharge/recharge.service';

const MobilePostpaid = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<Provider | null>(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionResult, setTransactionResult] = useState<any>(null);
  const [billDetails, setBillDetails] = useState<any>(null);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const data = await rechargeService.getProviders();
      const postpaidProviders = data.providers.filter(
        (p: Provider) => p.service_id === 3 && p.active === 1
      );
      setProviders(postpaidProviders);
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
    if (!mobileNumber || mobileNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid mobile number');
      return;
    }
    try {
      setLoading(true);
      setBillDetails({
        billerName: selectedOperator.provider_name,
        consumerNumber: mobileNumber,
        consumerName: 'John Doe',
        amount: 500,
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
    if (!selectedOperator) return handleFetchBill();
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
        message="Your mobile postpaid bill payment was successful"
        onDone={handleSuccessComplete}
      />
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 }}>
      <View className="mb-2">
        <Text className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          SELECT OPERATOR
        </Text>
      </View>

      {loading && providers.length === 0 ? (
        <View className="items-center justify-center py-12">
          <ActivityIndicator size="large" color="#6366f1" />
          <Text className="mt-2 text-muted-foreground">Loading operators...</Text>
        </View>
      ) : (
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
            keyboardType="phone-pad"
            maxLength={10}
          />

          <AmountInput value={amount} onChangeText={setAmount} />

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
                serviceName="Mobile Postpaid"
                billerName={billDetails.billerName}
                consumerNumber={billDetails.consumerNumber}
                amount={billDetails.amount}
                className="mt-2"
              />

              <View className="mt-2 flex-row gap-3">
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
      )}

      <LoadingOverlay visible={loading && providers.length > 0} message="Processing..." />
    </ScrollView>
  );
};

export default MobilePostpaid;
