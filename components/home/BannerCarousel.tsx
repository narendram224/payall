import React from 'react';
import { View, Text } from 'react-native';
import Carousel from '@/components/ui/carousel';
import { BannerItem } from '@/types/carousel.types';

const bannerData: BannerItem[] = [
  {
    id: 1,
    title: 'Get 20% Cashback',
    description: 'On first transaction',
    bgColor: 'from-blue-500 to-cyan-500',
  },
  {
    id: 2,
    title: 'Free Credit Card',
    description: 'With ₹0 joining fee',
    bgColor: 'from-purple-500 to-pink-500',
  },
  {
    id: 3,
    title: 'Loan Offer',
    description: 'Instant approval upto ₹5L',
    bgColor: 'from-orange-500 to-red-500',
  },
];

const BannerCarousel: React.FC = () => {
  const renderBanner = ({ item }: { item: BannerItem; index: number; currentIndex: number }) => (
    <View className={`mx-2 h-36 rounded-2xl bg-gradient-to-r ${item.bgColor} justify-center p-4`}>
      <Text className="mb-2 text-xl font-bold text-white">{item.title}</Text>
      <Text className="text-white/90">{item.description}</Text>
    </View>
  );

  return (
    <Carousel<BannerItem>
      data={bannerData}
      renderItem={renderBanner}
      autoPlay={true}
      autoPlayInterval={4000}
      dotStyle="modern"
      activeDotColor="#00B9F2"
      dotSize={8}
      carouselHeight={144}
      loop={true}
      parallaxEnabled={true}
      showArrows={false}
      rippleEffect={true}
      onSnapToItem={(index) => console.log('Current banner index:', index)}
    />
  );
};

export default BannerCarousel;
