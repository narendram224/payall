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
    if (!selectedMethod) {
      Alert.alert('Error', 'Please select a verification method');
      return;
    }

    try {
      setLoading(true);
      // TODO: Call API to initiate verification
      // await verificationService.initiate({
      //   aadhaar_number: aadhaarNumber,
      //   method: selectedMethod.name.toLowerCase(),
      // });

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
      // TODO: Call API to verify OTP
      // await verificationService.verifyOTP({
      //   aadhaar_number: aadhaarNumber,
      //   otp,
      // });

      setStep('success');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert('Error', 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'otp') {
      setStep('input');
    } else if (step === 'success') {
      setStep('input');
      setAadhaarNumber('');
      setOtp('');
    }
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
      <View className="flex-1 items-center justify-center bg-gray-50 p-6">
        <View className="items-center rounded-2xl bg-white p-6 shadow-sm">
          <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <Text className="text-4xl">✓</Text>
          </View>
          <Text className="mb-2 text-2xl font-bold text-gray-800">Verification Successful!</Text>
          <Text className="text-center text-gray-600">
            Your Aadhaar has been verified successfully
          </Text>
          <Button onPress={handleComplete} className="mt-4">
            <Text className="font-semibold text-white">Done</Text>
          </Button>
        </View>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <Text className="mb-6 text-2xl font-bold text-gray-800">Aadhaar Verification</Text>

        {step === 'input' && (
          <>
            <Text className="mb-4 text-lg font-semibold text-gray-800">Enter Aadhaar Number</Text>
            <AadhaarInput value={aadhaarNumber} onChange={setAadhaarNumber} className="mb-4" />
            <VerificationMethodSelector
              methods={verificationMethods}
              selectedMethod={selectedMethod}
              onSelectMethod={setSelectedMethod}
              className="mb-4"
            />
            <Button onPress={handleVerification} className="mt-4">
              <Text className="font-semibold text-white">Verify Aadhaar</Text>
            </Button>
          </>
        )}

        {step === 'otp' && (
          <>
            <Text className="mb-4 text-lg font-semibold text-gray-800">Enter OTP</Text>
            <OTPInput length={6} value={otp} onChange={setOtp} className="mb-4" />
            <View className="mt-4 flex-row gap-3">
              <Button onPress={handleBack} variant="outline" className="flex-1">
                <Text className="font-semibold">Back</Text>
              </Button>
              <Button onPress={handleOTPVerification} className="flex-1">
                <Text className="font-semibold text-white">Verify OTP</Text>
              </Button>
            </View>
          </>
        )}
      </View>

      <LoadingOverlay visible={loading} message="Processing..." />
    </ScrollView>
  );
};

export default Verification;
