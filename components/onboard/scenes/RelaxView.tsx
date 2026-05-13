import React, { useRef } from 'react';
import { StyleSheet, Text, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, interpolate } from 'react-native-reanimated';

interface Props {
  animationController: React.RefObject<import('react-native-reanimated').SharedValue<number>>;
}

const IMAGE_WIDTH = 350;
const IMAGE_HEIGHT = 250;

const RelaxView: React.FC<Props> = ({ animationController }) => {
  const window = useWindowDimensions();

  const relaxRef = useRef<Text | null>(null);

  const containerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      animationController.current.value,
      [0, 0.2, 0.4, 0.8],
      [0, 0, -window.width, -window.width]
    );
    return {
      transform: [{ translateX }],
    };
  });

  const titleStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      animationController.current.value,
      [0, 0.2, 0.8],
      [-(26 * 2), 0, 0]
    );
    return {
      transform: [{ translateY }],
    };
  });

  const subtitleStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      animationController.current.value,
      [0, 0.2, 0.4, 0.6, 0.8],
      [0, 0, -window.width * 2, 0, 0]
    );
    return {
      transform: [{ translateX }],
    };
  });

  const imageStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      animationController.current.value,
      [0, 0.2, 0.4, 0.6, 0.8],
      [0, 0, -350 * 4, 0, 0]
    );
    return {
      transform: [{ translateX }],
    };
  });

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.Text style={[styles.title, titleStyle]} ref={relaxRef}>
        Designed for trust
      </Animated.Text>
      <Animated.Text style={[styles.subtitle, subtitleStyle]}>
        Take control of your finances with secure transactions and beautifully simple payment flows.
      </Animated.Text>
      <Animated.Image
        style={[styles.image, imageStyle]}
        source={require('../../../assets/onBoard/relax_image.png')}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingBottom: 100,
  },
  title: {
    color: 'black',
    fontSize: 26,
    textAlign: 'center',
    fontFamily: 'WorkSans-Bold',
  },
  subtitle: {
    color: 'black',
    textAlign: 'center',
    fontFamily: 'WorkSans-Regular',
    paddingHorizontal: 64,
    paddingVertical: 16,
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    resizeMode: 'contain',
  },
});

export default RelaxView;
