// components/ui/Carousel.tsx
import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  ViewStyle,
  StyleProp,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Types
export type DotStyle = 'modern' | 'classic' | 'minimal' | 'pagination';
export type AnimationType = 'slide' | 'fade' | 'scale';

export interface CarouselItem {
  id: string | number;
  image?: ImageSourcePropType;
  title?: string;
  description?: string;
  [key: string]: any;
}

export interface CarouselProps<T = CarouselItem> {
  data: T[];
  renderItem?: (props: { item: T; index: number; currentIndex: number }) => React.ReactNode;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  dotStyle?: DotStyle;
  dotSize?: number;
  dotColor?: string;
  activeDotColor?: string;
  dotSpacing?: number;
  containerStyle?: StyleProp<ViewStyle>;
  carouselWidth?: number;
  carouselHeight?: number;
  loop?: boolean;
  onSnapToItem?: (index: number) => void;
  parallaxEnabled?: boolean;
  parallaxFactor?: number;
  showArrows?: boolean;
  arrowLeftIcon?: React.ReactNode;
  arrowRightIcon?: React.ReactNode;
  initialIndex?: number;
  animationType?: AnimationType;
  cardStyle?: StyleProp<ViewStyle>;
  gradientDots?: boolean;
  rippleEffect?: boolean;
}

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

function Carousel<T extends CarouselItem>({
  data = [],
  renderItem,
  autoPlay = false,
  autoPlayInterval = 3000,
  showDots = true,
  dotStyle = 'modern',
  dotSize = 8,
  dotColor = '#CBD5E1',
  activeDotColor = '#00B9F2',
  dotSpacing = 8,
  containerStyle = {},
  carouselWidth = SCREEN_WIDTH,
  carouselHeight = 200,
  loop = true,
  onSnapToItem = (index: number) => {},
  parallaxEnabled = false,
  parallaxFactor = 0.3,
  showArrows = false,
  arrowLeftIcon,
  arrowRightIcon,
  initialIndex = 0,
  animationType = 'slide',
  cardStyle = {},
  gradientDots = false,
  rippleEffect = true,
}: CarouselProps<T>) {
  const flatListRef = useRef<FlatList<T> | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(autoPlay);
  const scrollX = useSharedValue<number>(0);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isScrolling = useRef<boolean>(false);

  // Create infinite data by duplicating 3 times
  const getInfiniteData = useCallback((): T[] => {
    if (!loop || data.length <= 1) return data;
    // Duplicate data 3 times for smooth infinite scrolling
    return [...data, ...data, ...data];
  }, [loop, data]);

  const infiniteData = getInfiniteData();

  // Calculate middle index to start from (the second copy's first item)
  const getInitialScrollIndex = useCallback(() => {
    if (!loop || data.length <= 1) return initialIndex;
    // Start from the second copy (index = data.length)
    return data.length + initialIndex;
  }, [loop, data.length, initialIndex]);

  const initialScrollIndex = getInitialScrollIndex();

  // Stop auto play
  const stopAutoPlay = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
    }
  }, []);

  // Start auto play
  const startAutoPlay = useCallback(() => {
    if (!autoPlay || data.length <= 1) return;
    stopAutoPlay();
    autoPlayTimerRef.current = setInterval(() => {
      if (!isDragging.value && !isScrolling.current) {
        const nextIndex = (currentIndex + 1) % data.length;
        scrollToIndex(nextIndex, true);
      }
    }, autoPlayInterval);
  }, [autoPlay, data.length, currentIndex, autoPlayInterval]);

  useEffect(() => {
    if (autoPlay && isAutoPlaying) {
      startAutoPlay();
    }
    return () => stopAutoPlay();
  }, [autoPlay, isAutoPlaying, startAutoPlay, stopAutoPlay]);

  // Scroll to specific index
  const scrollToIndex = useCallback(
    (index: number, animated: boolean = true): void => {
      if (!flatListRef.current || data.length === 0 || isScrolling.current) return;

      let targetIndex = index;
      if (loop && data.length > 1) {
        // Calculate target index in the infinite data array
        const currentFlatListIndex = Math.floor(
          (flatListRef.current as any)?.props?.data?.length
            ? (flatListRef.current as any).props.data.length / 3
            : infiniteData.length / 3
        );
        const baseIndex = Math.floor(infiniteData.length / 3);
        targetIndex = baseIndex + index;

        // Ensure target index is within bounds
        if (targetIndex < 0) targetIndex = 0;
        if (targetIndex >= infiniteData.length) targetIndex = infiniteData.length - 1;
      }

      isScrolling.current = true;
      flatListRef.current.scrollToIndex({
        index: targetIndex,
        animated,
      });

      setCurrentIndex(index);
      onSnapToItem(index);

      setTimeout(() => {
        isScrolling.current = false;
      }, 500);
    },
    [data.length, loop, infiniteData.length, onSnapToItem]
  );

  // Handle scroll events
  const onScroll = useCallback(
    (event: any): void => {
      const offsetX = event.nativeEvent.contentOffset.x;
      scrollX.value = offsetX;

      if (!loop || data.length <= 1) {
        const index = Math.round(offsetX / carouselWidth);
        if (index !== currentIndex && index >= 0 && index < data.length && !isScrolling.current) {
          runOnJS(setCurrentIndex)(index);
          runOnJS(onSnapToItem)(index);
        }
        return;
      }

      // Calculate current index based on offset
      const index = Math.round(offsetX / carouselWidth);
      const realIndex = index % data.length;

      if (realIndex !== currentIndex && !isScrolling.current) {
        runOnJS(setCurrentIndex)(realIndex);
        runOnJS(onSnapToItem)(realIndex);
      }
    },
    [carouselWidth, data.length, loop, currentIndex, onSnapToItem]
  );

  // Handle momentum scroll end for infinite loop
  const onMomentumScrollEnd = useCallback(
    (event: any): void => {
      if (!loop || data.length <= 1) {
        isScrolling.current = false;
        return;
      }

      const offsetX = event.nativeEvent.contentOffset.x;
      const currentOffset = offsetX;
      const totalWidth = carouselWidth * data.length;
      const centerOffset = data.length * carouselWidth; // Start of second copy

      // Calculate new offset to keep in the middle section
      let newOffset = currentOffset;

      if (currentOffset < centerOffset - totalWidth) {
        // Too far left, jump forward
        newOffset = currentOffset + totalWidth;
      } else if (currentOffset > centerOffset + totalWidth) {
        // Too far right, jump backward
        newOffset = currentOffset - totalWidth;
      }

      if (newOffset !== currentOffset) {
        flatListRef.current?.scrollToOffset({
          offset: newOffset,
          animated: false,
        });
      }

      setTimeout(() => {
        isScrolling.current = false;
      }, 100);
    },
    [loop, data.length, carouselWidth]
  );

  // Pan gesture for manual control
  const translationX = useSharedValue<number>(0);
  const startX = useSharedValue<number>(0);
  const isDragging = useSharedValue<boolean>(false);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      isDragging.value = true;
      startX.value = translationX.value;
      if (autoPlay) runOnJS(stopAutoPlay)();
    })
    .onUpdate((event) => {
      translationX.value = startX.value + event.translationX;
    })
    .onEnd(() => {
      translationX.value = 0;
      isDragging.value = false;
      if (autoPlay) runOnJS(startAutoPlay)();
    });

  // Dot component
  const renderDot = (index: number, isActive: boolean): React.ReactNode => {
    const getDotContainerClass = (): string => {
      const spacingValue = dotSpacing / 4;
      return `mx-${spacingValue}`;
    };

    const getDotSizeClass = (): { width: number; height: number } => {
      if (isActive && dotStyle === 'pagination') {
        return { width: dotSize * 2, height: dotSize };
      }
      return { width: dotSize, height: dotSize };
    };

    const dotDimensions = getDotSizeClass();
    const isMinimalStyle = dotStyle === 'minimal';
    const borderRadius = isMinimalStyle ? 2 : dotSize / 2;

    if (gradientDots && isActive) {
      return (
        <TouchableOpacity
          key={index}
          onPress={() => scrollToIndex(index)}
          className={getDotContainerClass()}>
          <View
            style={{
              width: dotSize * 1.5,
              height: dotSize,
              backgroundColor: activeDotColor,
              borderRadius,
              overflow: 'hidden',
            }}
          />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        key={index}
        onPress={() => scrollToIndex(index)}
        className={getDotContainerClass()}>
        <View
          style={{
            backgroundColor: isActive ? activeDotColor : dotColor,
            width: dotDimensions.width,
            height: dotDimensions.height,
            borderRadius,
            transform: isActive && rippleEffect ? [{ scale: 1.1 }] : [{ scale: 1 }],
          }}>
          {rippleEffect && isActive && (
            <View className="absolute inset-0 rounded-full bg-current opacity-20" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Parallax animation for items
  const animatedStyle = useAnimatedStyle(() => {
    if (!parallaxEnabled) return {};

    const inputRange = [-carouselWidth, 0, carouselWidth];
    const translateX = interpolate(
      scrollX.value,
      inputRange,
      [-carouselWidth * parallaxFactor, 0, carouselWidth * parallaxFactor],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateX }],
    };
  });

  // Default render item
  const defaultRenderItem = useCallback(
    ({ item, index }: { item: T; index: number }) => {
      const realIndex = loop && data.length > 1 ? index % data.length : index;

      return (
        <View
          style={[
            {
              width: carouselWidth,
              height: carouselHeight,
              justifyContent: 'center',
              alignItems: 'center',
            },
            cardStyle as any,
          ]}>
          {item.image ? (
            <Image
              source={item.image}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 16,
              }}
              resizeMode="cover"
            />
          ) : (
            <View className="from-paytm-blue h-full w-full items-center justify-center rounded-2xl bg-gradient-to-r to-blue-600">
              <Text className="text-lg font-bold text-white">
                {item.title || `Slide ${realIndex + 1}`}
              </Text>
              <Text className="mt-2 text-sm text-white/80">{item.description}</Text>
            </View>
          )}
        </View>
      );
    },
    [carouselWidth, carouselHeight, cardStyle, loop, data.length]
  );

  // Render item wrapper
  const renderItemWrapper = useCallback(
    ({ item, index }: { item: T; index: number }) => {
      const actualIndex = loop && data.length > 1 ? index % data.length : index;

      if (renderItem) {
        return renderItem({
          item: item,
          index: actualIndex,
          currentIndex,
        }) as React.ReactElement;
      }

      return defaultRenderItem({ item, index: actualIndex });
    },
    [loop, data.length, renderItem, currentIndex, defaultRenderItem]
  );

  // Arrows component
  const Arrows = useCallback((): React.ReactNode => {
    if (!showArrows || data.length <= 1) return null;

    return (
      <>
        <TouchableOpacity
          onPress={() => {
            const prevIndex = currentIndex === 0 ? data.length - 1 : currentIndex - 1;
            scrollToIndex(prevIndex);
          }}
          className="absolute left-4 top-1/2 z-10 h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}>
          {arrowLeftIcon || <Text className="text-2xl text-gray-800">←</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            const nextIndex = (currentIndex + 1) % data.length;
            scrollToIndex(nextIndex);
          }}
          className="absolute right-4 top-1/2 z-10 h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}>
          {arrowRightIcon || <Text className="text-2xl text-gray-800">→</Text>}
        </TouchableOpacity>
      </>
    );
  }, [showArrows, data.length, currentIndex, scrollToIndex, arrowLeftIcon, arrowRightIcon]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[containerStyle, { position: 'relative' }]}>
        <GestureDetector gesture={panGesture}>
          <View>
            <AnimatedFlatList
              ref={flatListRef as any}
              data={infiniteData}
              renderItem={renderItemWrapper as any}
              keyExtractor={(item, index) => `carousel-${index}-${(item as any).id || index}`}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={onScroll}
              onMomentumScrollEnd={onMomentumScrollEnd}
              scrollEventThrottle={16}
              getItemLayout={(_, index) => ({
                length: carouselWidth,
                offset: carouselWidth * index,
                index,
              })}
              initialScrollIndex={initialScrollIndex}
              snapToInterval={carouselWidth}
              decelerationRate="fast"
              bounces={false}
              style={{ width: carouselWidth }}
              onScrollToIndexFailed={(info) => {
                // Fallback if scroll to index fails
                const wait = new Promise((resolve) => setTimeout(resolve, 500));
                wait.then(() => {
                  if (flatListRef.current && info.index >= 0 && info.index < infiniteData.length) {
                    flatListRef.current.scrollToIndex({
                      index: info.index,
                      animated: true,
                    });
                  }
                });
              }}
            />
          </View>
        </GestureDetector>

        <Arrows />

        {showDots && data.length > 1 && (
          <View className="absolute bottom-4 left-0 right-0 flex-row items-center justify-center">
            {data.map((_, index) => {
              const isActive = currentIndex === index;
              return renderDot(index, isActive);
            })}
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

export default Carousel;
