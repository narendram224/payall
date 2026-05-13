// components/home/index.jsx (Updated with carousel)
import React from 'react';
import { View, ScrollView, Image } from 'react-native';
import Carousel from '@/components/ui/carousel';
import BalanceCard from '@/components/home/BalanceCard';
import QuickActions from '@/components/home/QuickActions';
import ServiceGrid from '@/components/home/ServiceGrid';
import ExclusiveOffer from '@/components/home/ExclusiveOffer';
import { Text } from '@/components/ui/text';
import BannerCarousel from '@/components/home/BannerCarousel';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import PageLayout from '@/components/layout/PageLayout';
import { LinearGradient } from 'expo-linear-gradient';
import { cn } from '@/lib/utils';
import { Pressable } from 'react-native-gesture-handler';

const bannerData = [
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
  {
    id: 4,
    title: 'Get 20% Cashback',
    description: 'On first transaction',
    bgColor: 'from-blue-500 to-cyan-500',
  },
  {
    id: 0,
    title: 'Free Credit Card',
    description: 'With ₹0 joining fee',
    bgColor: 'from-purple-500 to-pink-500',
  },
  {
    id: 9,
    title: 'Loan Offer',
    description: 'Instant approval upto ₹5L',
    bgColor: 'from-orange-500 to-red-500',
  },
  {
    id: 6,
    title: 'Get 20% Cashback',
    description: 'On first transaction',
    bgColor: 'from-blue-500 to-cyan-500',
  },
  {
    id: 7,
    title: 'Free Credit Card',
    description: 'With ₹0 joining fee',
    bgColor: 'from-purple-500 to-pink-500',
  },
  {
    id: 8,
    title: 'Loan Offer',
    description: 'Instant approval upto ₹5L',
    bgColor: 'from-orange-500 to-red-500',
  },
];

const HomeScreen = () => {
  const renderBanner = ({ item }: { item: any }) => (
    <View className={`mx-4 h-36 rounded-2xl bg-gradient-to-r ${item.bgColor} justify-center p-4`}>
      <Text className="mb-2 text-xl font-bold text-white">{item.title}</Text>
      <Text className="text-white/90">{item.description}</Text>
    </View>
  );

  return (
    <PageLayout showBottomTabs={true} bottomMargin={80}>
      <ScrollView className="flex-1 bg-gray-50">
        {/* Banner Carousel */}
        <View className="mt-2">
          {/* <Carousel
            data={bannerData}
            renderItem={renderBanner}
            autoPlay={true}
            autoPlayInterval={4000}
            dotStyle="modern"
            activeDotColor="#00B9F2"
            dotSize={Math.max(4, renderBanner.length / 2)}
            carouselHeight={144}
            loop={true}
            parallaxEnabled={true}
            showArrows={false}
            rippleEffect={true}
          /> */}
        </View>

        {/* Balance Card */}
        {/* <BannerCarousel /> */}
        <View className="mt-4 px-4">
          <BalanceCard />
        </View>

        {/* Quick Actions */}
        <QuickActions />

        {/* Rest of your components */}
        <LinearGradient
          colors={['#f70394ff', '#1b09ffff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className='p-4 m-4 '
        >
          <ExclusiveOffer />
        </LinearGradient>


      </ScrollView>
    </PageLayout >
  );
};

export default HomeScreen;
