// components/home/ActionButtons.jsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { QrCode, UserPlus, PhoneCall, Users } from 'lucide-react-native';

const actions = [
  { icon: QrCode, label: 'Scan QR', color: '#00B9F2' },
  { icon: UserPlus, label: 'To Mobile', color: '#10B981' },
  { icon: PhoneCall, label: 'To Contact', color: '#F97316' },
  { icon: Users, label: 'To Self', color: '#8B5CF6' },
];

const ActionButtons = () => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row gap-4">
        {actions.map((action, index) => (
          <TouchableOpacity key={index} className="items-center">
            <View
              className="mb-2 h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}>
              <action.icon size={28} color={action.color} />
            </View>
            <Text className="text-xs text-gray-600">{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default ActionButtons;
