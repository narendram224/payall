import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import InsuranceTypeSelector from '@/components/selectors/InsuranceTypeSelector';
import VehicleDetailsForm from '@/components/forms/VehicleDetailsForm';
import PersonalDetailsForm from '@/components/forms/PersonalDetailsForm';
import TransactionSummary from '@/components/shared/TransactionSummary';
import SuccessScreen from '@/components/recharge/SuccessScreen';
import LoadingOverlay from '@/components/shared/LoadingOverlay';
import { Button } from '@/components/ui/button';

const Insurance = () => {
  const [step, setStep] = useState<'type' | 'details' | 'summary' | 'success'>('type');
  const [selectedType, setSelectedType] = useState<any>(null);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [registrationYear, setRegistrationYear] = useState('');
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactionResult, setTransactionResult] = useState<any>(null);

  const insuranceTypes = [
    { id: '1', name: 'Bike Insurance', icon: '', description: 'Two-wheeler insurance coverage' },
    { id: '2', name: 'Car Insurance', icon: '', description: 'Four-wheeler insurance coverage' },
    { id: '3', name: 'Health Insurance', icon: '', description: 'Health and medical insurance coverage' },
    { id: '4', name: 'Life Insurance', icon: '', description: 'Life insurance coverage' },
  ];

  const calculateAmount = () => {
    switch (selectedType?.id) {
      case '1': return 500;
      case '2': return 1000;
      case '3': return 2000;
      case '4': return 5000;
      default: return 1000;
    }
  };

  const handleTypeSelection = () => {
    if (!selectedType) { Alert.alert('Error', 'Please select insurance type'); return; }
    setStep('details');
  };

  const handleProceed = () => {
    if ((selectedType?.id === '1' || selectedType?.id === '2') && (!vehicleNumber || vehicleNumber.length < 10)) { Alert.alert('Error', 'Please enter a valid vehicle number'); return; }
    if ((selectedType?.id === '1' || selectedType?.id === '2') && !vehicleType) { Alert.alert('Error', 'Please enter vehicle type'); return; }
    if ((selectedType?.id === '3' || selectedType?.id === '4') && (!fullName || fullName.length < 3)) { Alert.alert('Error', 'Please enter full name'); return; }
    if ((selectedType?.id === '3' || selectedType?.id === '4') && !dateOfBirth) { Alert.alert('Error', 'Please enter date of birth'); return; }
    if ((selectedType?.id === '3' || selectedType?.id === '4') && !gender) { Alert.alert('Error', 'Please select gender'); return; }
    setStep('summary');
  };

  const handlePurchase = async () => {
    try {
      setLoading(true);
      setTransactionResult({ orderId: 'INS' + Date.now(), amount: calculateAmount(), status: 'success' });
      setStep('success');
    } catch {
      Alert.alert('Error', 'Insurance purchase failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'summary') setStep('details');
    else if (step === 'details') setStep('type');
    else if (step === 'success') setStep('type');
  };

  const handleComplete = () => {
    setStep('type');
    setSelectedType(null);
    setVehicleNumber('');
    setVehicleType('');
    setVehicleModel('');
    setRegistrationYear('');
    setFullName('');
    setDateOfBirth('');
    setGender('');
    setAddress('');
    setPincode('');
    router.back();
  };

  const activeStepIndex = step === 'type' ? 0 : step === 'details' ? 1 : 2;

  if (step === 'success') {
    return (
      <SuccessScreen
        orderId={transactionResult?.orderId}
        amount={transactionResult?.amount}
        message="Your insurance purchase was successful"
        onDone={handleComplete}
      />
    );
  }

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 }}>
      <View className="mb-2">
        <Text className="text-xs font-medium text-muted-foreground tracking-wider uppercase">INSURANCE</Text>
      </View>

       {/* Step Indicator */}
      <View className="mb-6 flex-row justify-between mt-2">
        {[0, 1, 2].map((idx) => (
          <View key={idx} className="flex-1 mx-0.5 h-1.5 rounded-full bg-muted overflow-hidden">
            <View
              className="h-full rounded-full bg-primary"
              style={{ width: idx <= activeStepIndex ? '100%' : '0%' }}
            />
          </View>
        ))}
      </View>

      {step === 'type' && (
        <View className="space-y-6">
          <Text className="text-lg font-semibold text-foreground mb-1">Select Insurance Type</Text>
          <InsuranceTypeSelector
            types={insuranceTypes}
            selectedType={selectedType}
            onSelectType={setSelectedType}
            className="mb-4"
          />
          <Button onPress={handleTypeSelection} className="w-full mt-2">
            <Text className="font-semibold text-primary-foreground">Proceed</Text>
          </Button>
        </View>
      )}

      {step === 'details' && (
        <View className="space-y-6">
          <Text className="text-lg font-semibold text-foreground mb-2">
            {selectedType?.name} Details
          </Text>

          {(selectedType?.id === '1' || selectedType?.id === '2') && (
            <VehicleDetailsForm
              vehicleNumber={vehicleNumber}
              setVehicleNumber={setVehicleNumber}
              vehicleType={vehicleType}
              setVehicleType={setVehicleType}
              vehicleModel={vehicleModel}
              setVehicleModel={setVehicleModel}
              registrationYear={registrationYear}
              setRegistrationYear={setRegistrationYear}
              className="mb-4"
            />
          )}

          {(selectedType?.id === '3' || selectedType?.id === '4') && (
            <PersonalDetailsForm
              fullName={fullName}
              setFullName={setFullName}
              dateOfBirth={dateOfBirth}
              setDateOfBirth={setDateOfBirth}
              gender={gender}
              setGender={setGender}
              address={address}
              setAddress={setAddress}
              pincode={pincode}
              setPincode={setPincode}
              className="mb-4"
            />
          )}

          <Button onPress={handleProceed} className="w-full mt-2">
            <Text className="font-semibold text-primary-foreground">Review Details</Text>
          </Button>
          <Button onPress={handleBack} variant="outline" className="w-full">
            <Text className="font-semibold text-foreground">Back</Text>
          </Button>
        </View>
      )}

      {step === 'summary' && (
        <View className="space-y-6">
          <Text className="text-lg font-semibold text-foreground mb-2">Review & Purchase</Text>
          <View className="bg-card rounded-xl p-4 border border-border">
            <View className="flex-row justify-between mb-3">
              <Text className="text-sm text-muted-foreground">Insurance Type</Text>
              <Text className="text-base font-semibold text-foreground">{selectedType?.name}</Text>
            </View>
            <View className="flex-row justify-between mb-3">
              <Text className="text-sm text-muted-foreground">Premium Amount</Text>
              <Text className="text-base font-bold text-primary">₹{calculateAmount()}</Text>
            </View>
          </View>

          <TransactionSummary
            transactionType="Insurance Purchase"
            recipientName={fullName || 'Self'}
            accountNumber={vehicleNumber || 'N/A'}
            bankName="Insurance Provider"
            amount={calculateAmount()}
            className="mb-4"
          />

          <View className="flex-row gap-3 mt-2">
            <Button onPress={handleBack} variant="outline" className="flex-1">
              <Text className="font-semibold text-foreground">Back</Text>
            </Button>
            <Button onPress={handlePurchase} className="flex-1">
              <Text className="font-semibold text-primary-foreground">Purchase</Text>
            </Button>
          </View>
        </View>
      )}

      <LoadingOverlay visible={loading} message="Processing..." />
    </ScrollView>
  );
};

export default Insurance;
