// components/home/ServiceGrid.jsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Smartphone, Car, Zap, CreditCard, Clock, Wifi } from 'lucide-react-native';

const services = [
  { icon: Smartphone, label: 'Mobile\nRecharge', color: '#00B9F2', badge: 'No Fee' },
  { icon: Car, label: 'FASTag\nRecharge', color: '#10B981' },
  { icon: Zap, label: 'Electricity\nBill', color: '#F97316' },
  { icon: CreditCard, label: 'Loan EMI\nPayment', color: '#8B5CF6' },
  { icon: Clock, label: 'DTH\nRecharge', color: '#EC4899' },
  { icon: Wifi, label: 'Broadband\nBill', color: '#6366F1' },
];

const ServiceGrid = () => {
  return (
    <View className="rounded-2xl bg-white p-4">
      <View className="flex-row flex-wrap">
        {services.map((service, index) => (
          <TouchableOpacity key={index} className="mb-6 w-1/3 items-center">
            <View className="relative">
              <View className="mb-2 h-14 w-14 items-center justify-center rounded-full bg-gray-50">
                <service.icon size={28} color={service.color} />
              </View>
              {service.badge && (
                <View className="absolute -right-2 -top-1 rounded-full bg-red-500 px-1.5 py-0.5">
                  <Text className="text-[8px] font-bold text-white">{service.badge}</Text>
                </View>
              )}
            </View>
            <Text className="text-center text-xs text-gray-600">{service.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ServiceGrid;
