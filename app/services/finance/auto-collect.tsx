import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
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
    { id: '1', label: 'Daily', value: 'daily', description: 'Collect amount daily' },
    { id: '2', label: 'Weekly', value: 'weekly', description: 'Collect amount every week' },
    { id: '3', label: 'Monthly', value: 'monthly', description: 'Collect amount every month' },
  ];

  const handleUPIVerification = async () => {
    if (!upiId || !upiId.includes('@')) {
      Alert.alert('Error', 'Please enter a valid UPI ID');
      return;
    }
    setLoading(true);
    setStep('rules');
    setLoading(false);
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
    <ScrollView
      style={{ flex: 1, backgroundColor: '#1c1c1c' }}
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 }}>
      {/* Benefits Banner */}
      <View style={styles.benefitsBanner}>
        <Text style={styles.benefitsTitle}>🔄 Auto Collect</Text>
        <Text style={styles.benefitsSubtitle}>Automate your recurring collections</Text>
        {[
          'Set once, collect automatically',
          'Daily, weekly or monthly schedules',
          'Instant UPI-based collection',
          'Real-time collection alerts',
        ].map((point, i) => (
          <View key={i} style={styles.benefitRow}>
            <CheckCircle2 size={16} color="#10b981" />
            <Text style={styles.benefitText}>{point}</Text>
          </View>
        ))}
      </View>

      {/* Step Indicator */}
      <View className="mb-6 mt-2 flex-row justify-between">
        {[0, 1, 2].map((idx) => (
          <View key={idx} className="mx-0.5 h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <View
              className="h-full rounded-full bg-primary"
              style={{ width: idx <= activeStepIndex ? '100%' : '0%' }}
            />
          </View>
        ))}
      </View>

      {step === 'upi' && (
        <View className="space-y-6">
          <Text className="mb-1 text-lg font-semibold text-foreground">Step 1: Link UPI ID</Text>
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
          <Text className="mb-1 text-lg font-semibold text-foreground">
            Step 2: Set Auto Collect Rules
          </Text>
          <FrequencySelector
            frequencies={frequencies}
            selectedFrequency={frequency}
            onSelectFrequency={setFrequency}
            className="mb-4"
          />
          <View className="space-y-4">
            <View>
              <Text className="mb-2 text-sm font-semibold text-foreground">Amount (₹)</Text>
              <Input
                placeholder="Enter amount to collect"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                className="h-14 text-center text-xl font-bold"
              />
            </View>
            <View>
              <Text className="mb-2 text-sm font-semibold text-foreground">
                Description (Optional)
              </Text>
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
          <Button onPress={handleSetupRules} className="mt-2 w-full">
            <Text className="font-semibold text-primary-foreground">Review Setup</Text>
          </Button>
          <Button onPress={handleBack} variant="outline" className="w-full">
            <Text className="font-semibold text-foreground">Back</Text>
          </Button>
        </View>
      )}

      {step === 'summary' && (
        <View className="space-y-6">
          <Text className="mb-1 text-lg font-semibold text-foreground">
            Step 3: Review & Activate
          </Text>
          <View className="rounded-xl border border-border bg-card p-4">
            <View className="mb-3 flex-row justify-between">
              <Text className="text-sm text-muted-foreground">UPI ID</Text>
              <Text className="text-base font-semibold text-foreground">{upiId}</Text>
            </View>
            <View className="mb-3 flex-row justify-between">
              <Text className="text-sm text-muted-foreground">Frequency</Text>
              <Text className="text-base font-semibold text-foreground">{frequency?.label}</Text>
            </View>
            <View className="mb-3 flex-row justify-between">
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

          <View className="mt-2 flex-row gap-3">
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

export default AutoCollect;
