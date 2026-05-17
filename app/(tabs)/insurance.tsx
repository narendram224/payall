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
    {
      id: '1',
      name: 'Bike Insurance',
      icon: '',
      description: 'Two-wheeler insurance coverage',
    },
    {
      id: '2',
      name: 'Car Insurance',
      icon: '',
      description: 'Four-wheeler insurance coverage',
    },
    {
      id: '3',
      name: 'Health Insurance',
      icon: '',
      description: 'Health and medical insurance coverage',
    },
    {
      id: '4',
      name: 'Life Insurance',
      icon: '',
      description: 'Life insurance coverage',
    },
  ];

  const handleTypeSelection = () => {
    if (!selectedType) {
      Alert.alert('Error', 'Please select insurance type');
      return;
    }
    setStep('details');
  };

  const handleProceed = () => {
    if (selectedType?.id === '1' || selectedType?.id === '2') {
      if (!vehicleNumber || vehicleNumber.length < 10) {
        Alert.alert('Error', 'Please enter a valid vehicle number');
        return;
      }
      if (!vehicleType) {
        Alert.alert('Error', 'Please enter vehicle type');
        return;
      }
    }

    if (selectedType?.id === '3' || selectedType?.id === '4') {
      if (!fullName || fullName.length < 3) {
        Alert.alert('Error', 'Please enter full name');
        return;
      }
      if (!dateOfBirth) {
        Alert.alert('Error', 'Please enter date of birth');
        return;
      }
      if (!gender) {
        Alert.alert('Error', 'Please select gender');
        return;
      }
    }

    setStep('summary');
  };

  const handlePurchase = async () => {
    try {
      setLoading(true);
      // TODO: Call API to purchase insurance
      // const result = await insuranceService.purchase({
      //   insurance_type: selectedType.id,
      //   vehicle_number: vehicleNumber,
      //   vehicle_type: vehicleType,
      //   full_name: fullName,
      //   date_of_birth: dateOfBirth,
      //   gender: gender,
      //   amount: calculateAmount(),
      // });

      setTransactionResult({
        orderId: 'INS' + Date.now(),
        amount: calculateAmount(),
        status: 'success',
      });
      setStep('success');
    } catch (error) {
      console.error('Error purchasing insurance:', error);
      Alert.alert('Error', 'Insurance purchase failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateAmount = () => {
    // Mock calculation based on insurance type
    switch (selectedType?.id) {
      case '1':
        return 500;
      case '2':
        return 1000;
      case '3':
        return 2000;
      case '4':
        return 5000;
      default:
        return 1000;
    }
  };

  const handleBack = () => {
    if (step === 'summary') {
      setStep('details');
    } else if (step === 'details') {
      setStep('type');
    } else if (step === 'success') {
      setStep('type');
    }
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
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <Text className="mb-6 text-2xl font-bold text-gray-800">Insurance</Text>

        {/* Step Indicator */}
        <View className="mb-6 flex-row justify-between">
          <View className="h-1 flex-1 rounded bg-gray-300">
            <View
              className={`h-full rounded ${step === 'type' ? 'w-1/4 bg-primary' : step === 'details' ? 'w-2/4 bg-primary' : step === 'summary' ? 'w-3/4 bg-primary' : step === 'success' ? 'bg-primary' : 'bg-gray-300'}`}
            />
          </View>
          <View className="h-1 flex-1 rounded bg-gray-300">
            <View
              className={`h-full rounded ${step === 'details' ? 'w-1/2 bg-primary' : step === 'summary' ? 'w-full bg-primary' : 'bg-gray-300'}`}
            />
          </View>
          <View className="h-1 flex-1 rounded bg-gray-300">
            <View
              className={`h-full rounded ${step === 'summary' ? 'w-full bg-primary' : 'bg-gray-300'}`}
            />
          </View>
        </View>

        {step === 'type' && (
          <>
            <Text className="mb-4 text-lg font-semibold text-gray-800">Select Insurance Type</Text>
            <InsuranceTypeSelector
              types={insuranceTypes}
              selectedType={selectedType}
              onSelectType={setSelectedType}
              className="mb-4"
            />
            <Button onPress={handleTypeSelection} className="mt-4">
              <Text className="font-semibold text-white">Proceed</Text>
            </Button>
          </>
        )}

        {step === 'details' && (
          <>
            <Text className="mb-4 text-lg font-semibold text-gray-800">
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

            <Button onPress={handleProceed} className="mt-4">
              <Text className="font-semibold text-white">Review Details</Text>
            </Button>
            <Button onPress={handleBack} variant="outline" className="mt-2">
              <Text className="font-semibold">Back</Text>
            </Button>
          </>
        )}

        {step === 'summary' && (
          <>
            <Text className="mb-4 text-lg font-semibold text-gray-800">Review & Purchase</Text>
            <View className="mb-4 rounded-xl bg-white p-4">
              <Text className="mb-2 text-sm text-gray-600">Insurance Type</Text>
              <Text className="text-base font-semibold">{selectedType?.name}</Text>
              <Text className="mb-2 mt-4 text-sm text-gray-600">Premium Amount</Text>
              <Text className="text-base font-bold text-primary">₹{calculateAmount()}</Text>
            </View>

            <TransactionSummary
              transactionType="Insurance Purchase"
              recipientName={fullName || 'Self'}
              accountNumber={vehicleNumber || 'N/A'}
              bankName="Insurance Provider"
              amount={calculateAmount()}
              className="mb-4"
            />

            <View className="mt-4 flex-row gap-3">
              <Button onPress={handleBack} variant="outline" className="flex-1">
                <Text className="font-semibold">Back</Text>
              </Button>
              <Button onPress={handlePurchase} className="flex-1">
                <Text className="font-semibold text-white">Purchase</Text>
              </Button>
            </View>
          </>
        )}
      </View>

      <LoadingOverlay visible={loading} message="Processing..." />
    </ScrollView>
  );
};

export default Insurance;
