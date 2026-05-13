// components/home/DotStylesDemo.jsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Carousel from '@/components/ui/carousel';

const sampleData = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  title: `Slide ${i + 1}`,
  color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
}));

const DotStylesDemo = () => {
  const renderItem = ({ item, index }) => (
    <View
      className="mx-4 flex-1 items-center justify-center rounded-xl"
      style={{ backgroundColor: item.color }}>
      <Text className="text-2xl font-bold text-white">{item.title}</Text>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Modern Dots (Default) */}
      <View className="mb-6">
        <Text className="mb-2 px-4 font-semibold">Modern Dots</Text>
        <Carousel
          data={sampleData}
          renderItem={renderItem}
          dotStyle="modern"
          activeDotColor="#00B9F2"
          carouselHeight={150}
        />
      </View>

      {/* Minimal Dots */}
      <View className="mb-6">
        <Text className="mb-2 px-4 font-semibold">Minimal Dots</Text>
        <Carousel
          data={sampleData}
          renderItem={renderItem}
          dotStyle="minimal"
          activeDotColor="#10B981"
          dotSize={4}
          carouselHeight={150}
        />
      </View>

      {/* Pagination Style Dots */}
      <View className="mb-6">
        <Text className="mb-2 px-4 font-semibold">Pagination Dots</Text>
        <Carousel
          data={sampleData}
          renderItem={renderItem}
          dotStyle="pagination"
          activeDotColor="#8B5CF6"
          dotSize={10}
          carouselHeight={150}
          rippleEffect={true}
        />
      </View>

      {/* Gradient Dots */}
      <View className="mb-6">
        <Text className="mb-2 px-4 font-semibold">Gradient Dots</Text>
        <Carousel
          data={sampleData}
          renderItem={renderItem}
          dotStyle="modern"
          activeDotColor="#F97316"
          gradientDots={true}
          carouselHeight={150}
        />
      </View>
    </ScrollView>
  );
};

export default DotStylesDemo;
