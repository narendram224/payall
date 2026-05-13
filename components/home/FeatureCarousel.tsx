// components/home/FeatureCarousel.jsx
import React from 'react';
import { View, Text } from 'react-native';
import Carousel from '@/components/ui/carousel';
import { QrCode, Wallet, Gift } from 'lucide-react-native';

const features = [
  {
    id: 1,
    icon: QrCode,
    title: 'Scan & Pay',
    description: 'Pay using any UPI app',
    color: '#00B9F2',
  },
  {
    id: 2,
    icon: Wallet,
    title: 'Wallet Money',
    description: 'Add money & get cashback',
    color: '#10B981',
  },
  {
    id: 3,
    icon: Gift,
    title: 'Exclusive Offers',
    description: 'Get amazing discounts',
    color: '#F97316',
  },
];

const FeatureCarousel = () => {
  const renderFeature = ({ item, index }: any) => (
    <View className="flex-1 items-center justify-center px-6">
      <View className="bg-paytm-blue/10 mb-4 h-20 w-20 items-center justify-center rounded-full">
        <item.icon size={40} color={item.color} />
      </View>
      <Text className="mb-2 text-center text-xl font-bold text-gray-800">{item.title}</Text>
      <Text className="text-center text-gray-500">{item.description}</Text>
    </View>
  );

  return (
    <View className="mt-4">
      <Carousel
        data={features}
        renderItem={renderFeature}
        dotStyle="minimal"
        dotColor="#CBD5E1"
        activeDotColor="#00B9F2"
        dotSize={4}
        carouselHeight={220}
        autoPlay={true}
        autoPlayInterval={3000}
        animationType="fade"
      />
    </View>
  );
};

export default FeatureCarousel;
