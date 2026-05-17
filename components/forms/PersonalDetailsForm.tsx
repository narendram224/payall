import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface PersonalDetailsFormProps {
  fullName: string;
  setFullName: (value: string) => void;
  dateOfBirth: string;
  setDateOfBirth: (value: string) => void;
  gender: string;
  setGender: (value: string) => void;
  address?: string;
  setAddress?: (value: string) => void;
  pincode?: string;
  setPincode?: (value: string) => void;
  className?: string;
}

const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({
  fullName,
  setFullName,
  dateOfBirth,
  setDateOfBirth,
  gender,
  setGender,
  address,
  setAddress,
  pincode,
  setPincode,
  className,
}) => {
  const [errors, setErrors] = useState<{
    fullName?: string;
    dateOfBirth?: string;
    gender?: string;
    pincode?: string;
  }>({});

  const validateFullName = (value: string) => {
    if (!value) {
      setErrors((prev) => ({ ...prev, fullName: 'Full name is required' }));
    } else if (value.length < 3) {
      setErrors((prev) => ({ ...prev, fullName: 'Name must be at least 3 characters' }));
    } else {
      setErrors((prev) => ({ ...prev, fullName: undefined }));
    }
  };

  const validateDateOfBirth = (value: string) => {
    if (!value) {
      setErrors((prev) => ({ ...prev, dateOfBirth: 'Date of birth is required' }));
    } else {
      setErrors((prev) => ({ ...prev, dateOfBirth: undefined }));
    }
  };

  const validateGender = (value: string) => {
    if (!value) {
      setErrors((prev) => ({ ...prev, gender: 'Gender is required' }));
    } else {
      setErrors((prev) => ({ ...prev, gender: undefined }));
    }
  };

  const validatePincode = (value: string) => {
    if (value) {
      const pincodeRegex = /^[1-9][0-9]{5}$/;
      if (!pincodeRegex.test(value)) {
        setErrors((prev) => ({ ...prev, pincode: 'Invalid pincode (must be 6 digits)' }));
      } else {
        setErrors((prev) => ({ ...prev, pincode: undefined }));
      }
    }
  };

  return (
    <View className={cn('space-y-4', className)}>
      <View>
        <Text className="mb-2 text-sm font-medium text-gray-700">Full Name</Text>
        <Input
          placeholder="Enter full name"
          value={fullName}
          onChangeText={(text) => {
            setFullName(text);
            validateFullName(text);
          }}
          className={errors.fullName ? 'border-red-500' : ''}
        />
        {errors.fullName && <Text className="mt-1 text-xs text-red-500">{errors.fullName}</Text>}
      </View>

      <View>
        <Text className="mb-2 text-sm font-medium text-gray-700">Date of Birth</Text>
        <Input
          placeholder="DD/MM/YYYY"
          value={dateOfBirth}
          onChangeText={(text) => {
            setDateOfBirth(text);
            validateDateOfBirth(text);
          }}
          keyboardType="number-pad"
          maxLength={10}
          className={errors.dateOfBirth ? 'border-red-500' : ''}
        />
        {errors.dateOfBirth && (
          <Text className="mt-1 text-xs text-red-500">{errors.dateOfBirth}</Text>
        )}
      </View>

      <View>
        <Text className="mb-2 text-sm font-medium text-gray-700">Gender</Text>
        <Input
          placeholder="Male/Female/Other"
          value={gender}
          onChangeText={(text) => {
            setGender(text);
            validateGender(text);
          }}
          className={errors.gender ? 'border-red-500' : ''}
        />
        {errors.gender && <Text className="mt-1 text-xs text-red-500">{errors.gender}</Text>}
      </View>

      {address && (
        <View>
          <Text className="mb-2 text-sm font-medium text-gray-700">Address (Optional)</Text>
          <Input
            placeholder="Enter address"
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
            className="h-24"
          />
        </View>
      )}

      {pincode && (
        <View>
          <Text className="mb-2 text-sm font-medium text-gray-700">Pincode (Optional)</Text>
          <Input
            placeholder="Enter pincode"
            value={pincode}
            onChangeText={(text) => {
              setPincode?.(text);
              validatePincode(text);
            }}
            keyboardType="number-pad"
            maxLength={6}
            className={errors.pincode ? 'border-red-500' : ''}
          />
          {errors.pincode && <Text className="mt-1 text-xs text-red-500">{errors.pincode}</Text>}
        </View>
      )}
    </View>
  );
};

export default PersonalDetailsForm;
