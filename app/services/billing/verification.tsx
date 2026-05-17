import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import AadhaarInput from '@/components/forms/AadhaarInput';
import VerificationMethodSelector from '@/components/selectors/VerificationMethodSelector';
import LoadingOverlay from '@/components/shared/LoadingOverlay';
import { Button } from '@/components/ui/button';
import { OTPInput } from '@/components/ui/otp-input';

const Verification = () => {
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'otp' | 'success'>('input');

  const verificationMethods = [
    {
      id: '1',
      name: 'OTP',
      icon: '',
      description: 'Receive OTP on registered mobile number',
    },
    {
      id: '2',
      name: 'Biometric',
      icon: '',
      description: 'Use fingerprint or iris scan for verification',
    },
  ];

  const handleVerification = async () => {
    if (!aadhaarNumber || aadhaarNumber.length !== 12) {
      Alert.alert('Error', 'Please enter a valid 12-digit Aadhaar number');
      return;
    }
    if (!selectedMethod) { Alert.alert('Error', 'Please select a verification method'); return; }
    try {
      setLoading(true);
      setStep('otp');
    } catch (error) {
      console.error('Error initiating verification:', error);
      Alert.alert('Error', 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter the 6-digit OTP');
      return;
    }
    try {
      setLoading(true);
      setStep('success');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert('Error', 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'otp') { setStep('input'); }
    else if (step === 'success') { setStep('input'); setAadhaarNumber(''); setOtp(''); }
  };

  const handleComplete = () => {
    setStep('input');
    setAadhaarNumber('');
    setOtp('');
    setSelectedMethod(null);
    router.back();
  };

  if (step === 'success') {
    return (
      <View className="flex-1 items-center justify-center bg-background p-6">
        <View className="items-center rounded-2xl bg-card p-6 shadow-sm border border-border w-full">
          <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-success/15">
            <Text className="text-4xl text-success">✓</Text>
          </View>
          <Text className="mb-2 text-2xl font-bold text-foreground">Verification Successful!</Text>
          <Text className="text-center text-muted-foreground">
            Your Aadhaar has been verified successfully
          </Text>
          <Button onPress={handleComplete} className="mt-4 w-full">
            <Text className="font-semibold text-primary-foreground">Done</Text>
          </Button>
        </View>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 }}>
      <View className="mb-2">
        <Text className="text-xs font-medium text-muted-foreground tracking-wider uppercase">VERIFICATION</Text>
      </View>

      {step === 'input' && (
        <View className="space-y-6">
          <Text className="mb-2 text-lg font-semibold text-foreground">Enter Aadhaar Number</Text>
          <AadhaarInput value={aadhaarNumber} onChange={setAadhaarNumber} className="mb-4" />
          <VerificationMethodSelector
            methods={verificationMethods}
            selectedMethod={selectedMethod}
            onSelectMethod={setSelectedMethod}
            className="mb-4"
          />
          <Button onPress={handleVerification} className="w-full mt-2">
            <Text className="font-semibold text-primary-foreground">Verify Aadhaar</Text>
          </Button>
        </View>
      )}

      {step === 'otp' && (
        <View className="space-y-6">
          <Text className="mb-2 text-lg font-semibold text-foreground">Enter OTP</Text>
          <OTPInput length={6} value={otp} onChange={setOtp} className="mb-4" />
          <View className="flex-row gap-3 mt-2">
            <Button onPress={handleBack} variant="outline" className="flex-1">
              <Text className="font-semibold text-foreground">Back</Text>
            </Button>
            <Button onPress={handleOTPVerification} className="flex-1">
              <Text className="font-semibold text-primary-foreground">Verify OTP</Text>
            </Button>
          </View>
        </View>
      )}

      <LoadingOverlay visible={loading} message="Processing..." />
    </ScrollView>
  );
};

export default Verification;
