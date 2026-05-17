import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface RecipientFormProps {
  recipientName: string;
  setRecipientName: (value: string) => void;
  recipientEmail?: string;
  setRecipientEmail?: (value: string) => void;
  recipientPhone?: string;
  setRecipientPhone?: (value: string) => void;
  message?: string;
  setMessage?: (value: string) => void;
  showEmail?: boolean;
  showPhone?: boolean;
  showMessage?: boolean;
  className?: string;
}

const RecipientForm: React.FC<RecipientFormProps> = ({
  recipientName,
  setRecipientName,
  recipientEmail,
  setRecipientEmail,
  recipientPhone,
  setRecipientPhone,
  message,
  setMessage,
  showEmail = true,
  showPhone = true,
  showMessage = true,
  className,
}) => {
  const [errors, setErrors] = useState<{
    recipientName?: string;
    recipientEmail?: string;
    recipientPhone?: string;
  }>({});

  const validateRecipientName = (value: string) => {
    if (!value) {
      setErrors((prev) => ({ ...prev, recipientName: 'Recipient name is required' }));
    } else if (value.length < 3) {
      setErrors((prev) => ({ ...prev, recipientName: 'Name must be at least 3 characters' }));
    } else {
      setErrors((prev) => ({ ...prev, recipientName: undefined }));
    }
  };

  const validateEmail = (value: string) => {
    if (value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setErrors((prev) => ({ ...prev, recipientEmail: 'Invalid email address' }));
      } else {
        setErrors((prev) => ({ ...prev, recipientEmail: undefined }));
      }
    }
  };

  const validatePhone = (value: string) => {
    if (value) {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(value)) {
        setErrors((prev) => ({ ...prev, recipientPhone: 'Invalid phone number' }));
      } else {
        setErrors((prev) => ({ ...prev, recipientPhone: undefined }));
      }
    }
  };

  return (
    <View className={cn('space-y-4', className)}>
      <View>
        <Text className="mb-2 text-sm font-medium text-gray-700">Recipient Name</Text>
        <Input
          placeholder="Enter recipient name"
          value={recipientName}
          onChangeText={(text) => {
            setRecipientName(text);
            validateRecipientName(text);
          }}
          className={errors.recipientName ? 'border-red-500' : ''}
        />
        {errors.recipientName && (
          <Text className="mt-1 text-xs text-red-500">{errors.recipientName}</Text>
        )}
      </View>

      {showEmail && (
        <View>
          <Text className="mb-2 text-sm font-medium text-gray-700">Email (Optional)</Text>
          <Input
            placeholder="Enter recipient email"
            value={recipientEmail}
            onChangeText={(text) => {
              setRecipientEmail?.(text);
              validateEmail(text);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            className={errors.recipientEmail ? 'border-red-500' : ''}
          />
          {errors.recipientEmail && (
            <Text className="mt-1 text-xs text-red-500">{errors.recipientEmail}</Text>
          )}
        </View>
      )}

      {showPhone && (
        <View>
          <Text className="mb-2 text-sm font-medium text-gray-700">Phone (Optional)</Text>
          <Input
            placeholder="Enter recipient phone"
            value={recipientPhone}
            onChangeText={(text) => {
              setRecipientPhone?.(text);
              validatePhone(text);
            }}
            keyboardType="phone-pad"
            maxLength={10}
            className={errors.recipientPhone ? 'border-red-500' : ''}
          />
          {errors.recipientPhone && (
            <Text className="mt-1 text-xs text-red-500">{errors.recipientPhone}</Text>
          )}
        </View>
      )}

      {showMessage && (
        <View>
          <Text className="mb-2 text-sm font-medium text-gray-700">Message (Optional)</Text>
          <Input
            placeholder="Add a personal message"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={3}
            className="h-24"
          />
        </View>
      )}
    </View>
  );
};

export default RecipientForm;
