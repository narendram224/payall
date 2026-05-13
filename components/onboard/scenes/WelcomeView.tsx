import React, { useRef } from 'react';
import { StyleSheet, Text, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, interpolate } from 'react-native-reanimated';

interface Props {
  animationController: React.RefObject<import('react-native-reanimated').SharedValue<number>>;
}

const IMAGE_WIDTH = 350;
const IMAGE_HEIGHT = 350;

const WelcomeView: React.FC<Props> = ({ animationController }) => {
  const window = useWindowDimensions();

  const careRef = useRef<Text | null>(null);

  const containerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      animationController.current.value,
      [0, 0.6, 0.8],
      [window.width, window.width, 0]
    );
    return {
      transform: [{ translateX }],
    };
  });

  const textEndVal = 26 * 2;
  const titleStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      animationController.current.value,
      [0, 0.6, 0.8],
      [textEndVal, textEndVal, 0]
    );
    return {
      transform: [{ translateX }],
    };
  });

  const imageEndVal = IMAGE_WIDTH * 4;
  const imageStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      animationController.current.value,
      [0, 0.6, 0.8],
      [imageEndVal, imageEndVal, 0]
    );
    return {
      transform: [{ translateX }],
    };
  });

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.Image
        style={[styles.image, imageStyle]}
        source={require('../../../assets/onBoard/welcome.png')}
      />
      <Animated.Text style={[styles.title, titleStyle]} ref={careRef}>
        Welcome,
      </Animated.Text>
      <Text style={styles.subtitle}>
        Simplify your financial life with one powerful app built for speed, trust, and convenience.
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 100,
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    resizeMode: 'contain',
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
});

export default WelcomeView;
