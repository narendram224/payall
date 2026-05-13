import React, { useRef } from 'react';
import { StyleSheet, Text, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, interpolate } from 'react-native-reanimated';
interface Props {
  animationController: React.RefObject<import('react-native-reanimated').SharedValue<number>>;
}

const IMAGE_WIDTH = 350;
const IMAGE_HEIGHT = 250;

const MoodDiaryView: React.FC<Props> = ({ animationController }) => {
  const window = useWindowDimensions();

  const careRef = useRef<Text | null>(null);

  const containerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      animationController.current.value,
      [0, 0.4, 0.6, 0.8],
      [window.width, window.width, 0, 0]
    );
    return {
      transform: [{ translateX }],
    };
  });

  const textEndVal = window.width * 2;
  const subtitleStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      animationController.current.value,
      [0, 0.4, 0.6, 0.8],
      [textEndVal, textEndVal, 0, -textEndVal]
    );
    return {
      transform: [{ translateX }],
    };
  });

  const imageEndVal = IMAGE_WIDTH * 4;
  const imageStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      animationController.current.value,
      [0, 0.4, 0.6, 0.8],
      [imageEndVal, imageEndVal, 0, -imageEndVal]
    );
    return {
      transform: [{ translateX }],
    };
  });

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Text style={styles.title} ref={careRef}>
        Modern banking
      </Text>
      <Animated.Text style={[styles.subtitle, subtitleStyle]}>
        Your trusted financial hub for instant payments, smart bill tracking, and secure money
        transfers.
      </Animated.Text>
      <Animated.Image
        style={[styles.image, imageStyle]}
        source={require('../../../assets/onBoard/mood_dairy_image.png')}
      />
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

export default MoodDiaryView;
