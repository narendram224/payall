import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface VehicleDetailsFormProps {
  vehicleNumber: string;
  setVehicleNumber: (value: string) => void;
  vehicleType: string;
  setVehicleType: (value: string) => void;
  vehicleModel?: string;
  setVehicleModel?: (value: string) => void;
  registrationYear?: string;
  setRegistrationYear?: (value: string) => void;
  className?: string;
}

const VehicleDetailsForm: React.FC<VehicleDetailsFormProps> = ({
  vehicleNumber,
  setVehicleNumber,
  vehicleType,
  setVehicleType,
  vehicleModel,
  setVehicleModel,
  registrationYear,
  setRegistrationYear,
  className,
}) => {
  const [errors, setErrors] = useState<{
    vehicleNumber?: string;
    vehicleType?: string;
  }>({});

  const validateVehicleNumber = (value: string) => {
    // Indian vehicle number format: XX XX XX XXXX
    const vehicleRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;
    if (!value) {
      setErrors(prev => ({ ...prev, vehicleNumber: 'Vehicle number is required' }));
    } else if (!vehicleRegex.test(value.toUpperCase())) {
      setErrors(prev => ({ ...prev, vehicleNumber: 'Invalid vehicle number format (e.g., MH01AB1234)' }));
    } else {
      setErrors(prev => ({ ...prev, vehicleNumber: undefined }));
    }
  };

  const validateVehicleType = (value: string) => {
    if (!value) {
      setErrors(prev => ({ ...prev, vehicleType: 'Vehicle type is required' }));
    } else {
      setErrors(prev => ({ ...prev, vehicleType: undefined }));
    }
  };

  return (
    <View className={cn('space-y-4', className)}>
      <View>
        <Text className="text-sm font-medium text-gray-700 mb-2">Vehicle Number</Text>
        <Input
          placeholder="Enter vehicle number (e.g., MH01AB1234)"
          value={vehicleNumber}
          onChangeText={(text) => {
            setVehicleNumber(text.toUpperCase());
            validateVehicleNumber(text.toUpperCase());
          }}
          autoCapitalize="characters"
          maxLength={10}
          className={errors.vehicleNumber ? 'border-red-500' : ''}
        />
        {errors.vehicleNumber && (
          <Text className="text-xs text-red-500 mt-1">{errors.vehicleNumber}</Text>
        )}
      </View>

      <View>
        <Text className="text-sm font-medium text-gray-700 mb-2">Vehicle Type</Text>
        <Input
          placeholder="Enter vehicle type (e.g., Two Wheeler, Four Wheeler)"
          value={vehicleType}
          onChangeText={(text) => {
            setVehicleType(text);
            validateVehicleType(text);
          }}
          className={errors.vehicleType ? 'border-red-500' : ''}
        />
        {errors.vehicleType && (
          <Text className="text-xs text-red-500 mt-1">{errors.vehicleType}</Text>
        )}
      </View>

      {vehicleModel && (
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">Vehicle Model (Optional)</Text>
          <Input
            placeholder="Enter vehicle model"
            value={vehicleModel}
            onChangeText={setVehicleModel}
          />
        </View>
      )}

      {registrationYear && (
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">Registration Year (Optional)</Text>
          <Input
            placeholder="Enter registration year"
            value={registrationYear}
            onChangeText={setRegistrationYear}
            keyboardType="number-pad"
            maxLength={4}
          />
        </View>
      )}
    </View>
  );
};

export default VehicleDetailsForm;
