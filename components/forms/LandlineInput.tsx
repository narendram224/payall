import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Input } from '@/components/ui/input';
import CircleSelector from '@/components/forms/CircleSelector';
import { cn } from '@/lib/utils';

interface Circle {
  id: string;
  name: string;
  code: string;
}

interface LandlineInputProps {
  stdCode: string;
  setStdCode: (value: string) => void;
  landlineNumber: string;
  setLandlineNumber: (value: string) => void;
  circles: Circle[];
  selectedCircle: Circle | null;
  onSelectCircle: (circle: Circle) => void;
  className?: string;
}

const LandlineInput: React.FC<LandlineInputProps> = ({
  stdCode,
  setStdCode,
  landlineNumber,
  setLandlineNumber,
  circles,
  selectedCircle,
  onSelectCircle,
  className,
}) => {
  const [errors, setErrors] = useState<{
    stdCode?: string;
    landlineNumber?: string;
  }>({});

  const validateStdCode = (value: string) => {
    if (!value) {
      setErrors((prev) => ({ ...prev, stdCode: 'STD code is required' }));
    } else if (value.length < 2 || value.length > 4) {
      setErrors((prev) => ({ ...prev, stdCode: 'STD code must be 2-4 digits' }));
    } else {
      setErrors((prev) => ({ ...prev, stdCode: undefined }));
    }
  };

  const validateLandlineNumber = (value: string) => {
    if (!value) {
      setErrors((prev) => ({ ...prev, landlineNumber: 'Landline number is required' }));
    } else if (value.length < 6) {
      setErrors((prev) => ({
        ...prev,
        landlineNumber: 'Landline number must be at least 6 digits',
      }));
    } else {
      setErrors((prev) => ({ ...prev, landlineNumber: undefined }));
    }
  };

  return (
    <View className={cn('space-y-4', className)}>
      <CircleSelector
        circles={circles}
        selectedCircle={selectedCircle}
        onSelectCircle={onSelectCircle}
      />

      <View>
        <Text className="mb-2 text-sm font-medium text-gray-700">STD Code</Text>
        <Input
          placeholder="Enter STD code (e.g., 011)"
          value={stdCode}
          onChangeText={(text) => {
            setStdCode(text);
            validateStdCode(text);
          }}
          keyboardType="number-pad"
          maxLength={4}
          className={errors.stdCode ? 'border-red-500' : ''}
        />
        {errors.stdCode && <Text className="mt-1 text-xs text-red-500">{errors.stdCode}</Text>}
      </View>

      <View>
        <Text className="mb-2 text-sm font-medium text-gray-700">Landline Number</Text>
        <Input
          placeholder="Enter landline number"
          value={landlineNumber}
          onChangeText={(text) => {
            setLandlineNumber(text);
            validateLandlineNumber(text);
          }}
          keyboardType="number-pad"
          className={errors.landlineNumber ? 'border-red-500' : ''}
        />
        {errors.landlineNumber && (
          <Text className="mt-1 text-xs text-red-500">{errors.landlineNumber}</Text>
        )}
      </View>
    </View>
  );
};

export default LandlineInput;
