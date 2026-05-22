import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
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
    { id: '1', name: 'Net Banking', icon: '', type: 'netbanking' },
    { id: '2', name: 'Credit Card', icon: '', type: 'card' },
    { id: '3', name: 'Debit Card', icon: '', type: 'card' },
    { id: '4', name: 'UPI', icon: '', type: 'upi' },
    { id: '5', name: 'Wallet', icon: '', type: 'wallet' },
  ];

  const calculateAmount = () => 1000;

  const handleProceed = () => {
    if (!selectedMethod) { Alert.alert('Error', 'Please select a payment method'); return; }
    if (['card', 'wallet'].includes(selectedMethod.type) && (!accountNumber || accountNumber.length < 16)) { Alert.alert('Error', 'Please enter a valid card number'); return; }
    if (['card', 'wallet'].includes(selectedMethod.type) && !expiryDate) { Alert.alert('Error', 'Please enter expiry date'); return; }
    if (['card', 'wallet'].includes(selectedMethod.type) && (!cvv || cvv.length !== 3)) { Alert.alert('Error', 'Please enter CVV'); return; }
    if (['netbanking', 'upi'].includes(selectedMethod.type) && (!accountNumber || accountNumber.length < 9)) { Alert.alert('Error', 'Please enter valid account details'); return; }
    if (['netbanking', 'upi'].includes(selectedMethod.type) && (!ifscCode || ifscCode.length !== 11)) { Alert.alert('Error', 'Please enter valid IFSC code'); return; }
    setShowSummary(true);
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setTransactionResult({ orderId: 'PG' + Date.now(), amount: calculateAmount(), status: 'success' });
      setShowSuccess(true);
    } catch {
      Alert.alert('Error', 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => { setShowSummary(false); };

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
    <ScrollView style={{ flex: 1, backgroundColor: '#1c1c1c' }} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 }}>

      {/* Benefits Banner */}
      <View style={styles.benefitsBanner}>
        <Text style={styles.benefitsTitle}>💳 Payment Gateway</Text>
        <Text style={styles.benefitsSubtitle}>Secure multi-mode payment processing</Text>
        {[
          'Supports UPI, Cards, Net Banking & Wallets',
          'Instant payment confirmation',
          'Bank-grade 256-bit encryption',
          'Zero transaction failure rate',
        ].map((point, i) => (
          <View key={i} style={styles.benefitRow}>
            <CheckCircle2 size={16} color="#10b981" />
            <Text style={styles.benefitText}>{point}</Text>
          </View>
        ))}
      </View>

      <PaymentMethodSelector
        methods={paymentMethods}
        selectedMethod={selectedMethod}
        onSelectMethod={setSelectedMethod}
        className="mb-4"
      />

      {(selectedMethod?.type === 'card' || selectedMethod?.type === 'wallet') && (
        <View className="space-y-4 mb-4">
          <BankDetailsInput
            accountNumber={accountNumber}
            setAccountNumber={setAccountNumber}
            ifscCode={ifscCode}
            setIfscCode={setIfscCode}
            accountHolderName={accountHolderName}
            setAccountHolderName={setAccountHolderName}
            className="mb-0"
          />
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="text-sm font-semibold text-foreground mb-2">Expiry Date</Text>
              <Input placeholder="MM/YY" value={expiryDate} onChangeText={setExpiryDate} />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-foreground mb-2">CVV</Text>
              <Input placeholder="123" value={cvv} onChangeText={setCvv} maxLength={3} className="text-center" keyboardType="numeric" />
            </View>
          </View>
        </View>
      )}

      {(selectedMethod?.type === 'netbanking' || selectedMethod?.type === 'upi') && (
        <View className="mb-4">
          <BankDetailsInput
            accountNumber={accountNumber}
            setAccountNumber={setAccountNumber}
            ifscCode={ifscCode}
            setIfscCode={setIfscCode}
            accountHolderName={accountHolderName}
            setAccountHolderName={setAccountHolderName}
            className="mb-0"
          />
        </View>
      )}

      {!showSummary && (
        <Button onPress={handleProceed} className="w-full mt-2">
          <Text className="font-semibold text-primary-foreground">Proceed</Text>
        </Button>
      )}

      {showSummary && (
        <View className="space-y-6">
          <TransactionSummary
            transactionType={`${selectedMethod?.name} Payment`}
            recipientName={accountHolderName}
            accountNumber={accountNumber}
            bankName={selectedMethod?.name}
            amount={calculateAmount()}
            className="mb-4"
          />

          <View className="flex-row gap-3 mt-2">
            <Button onPress={handleBack} variant="outline" className="flex-1">
              <Text className="font-semibold text-foreground">Back</Text>
            </Button>
            <Button onPress={handlePayment} className="flex-1">
              <Text className="font-semibold text-primary-foreground">Pay Now</Text>
            </Button>
          </View>
        </View>
      )}

      <LoadingOverlay visible={loading} message="Processing..." />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  benefitsBanner: {
    backgroundColor: '#1e1b4b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#312e81',
  },
  benefitsTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  benefitsSubtitle: { color: '#a5b4fc', fontSize: 13, marginBottom: 12 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  benefitText: { color: '#e0e7ff', fontSize: 13, flex: 1 },
});

export default PaymentGateway;
