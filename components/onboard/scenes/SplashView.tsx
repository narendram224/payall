import React from 'react';
import { StyleSheet, View, Text, Image, useWindowDimensions, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, interpolate } from 'react-native-reanimated';
import { Button } from '@/components/ui/button';

interface Props {
  onNextClick: () => void;
  animationController: React.RefObject<import('react-native-reanimated').SharedValue<number>>;
}

const SplashView: React.FC<Props> = ({ onNextClick, animationController }) => {
  const window = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const splashStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      animationController.current.value,
      [0, 0.2, 0.8],
      [0, -window.height, -window.height]
    );
    return {
      transform: [{ translateY }],
    };
  });

  return (
    <Animated.View style={[{ flex: 1 }, splashStyle]}>
      <ScrollView style={{ flexGrow: 0 }} alwaysBounceVertical={false}>
        <View style={{ alignItems: 'center', paddingHorizontal: 24 }}>
          <Image
            style={{
              width: window.width - 48,
              height: window.width * 1.2,
              borderRadius: 16,
              resizeMode: 'cover',
            }}
            source={require('../../../assets/onBoard/introduction_image.png')}
          />
        </View>
        <View style={{ alignItems: 'center', paddingHorizontal: 16 }}>
          <Text style={styles.title}>Secure transactions</Text>
          <Text style={styles.subtitle}>
            From mobile recharges to bank transfers, everything you need is now just one tap away.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: 8 + insets.bottom }]}>
        <View style={styles.buttonContainer}>
          <Button style={styles.button} onPress={() => onNextClick()}>
            <Text style={styles.buttonText}>Let&apos;s begin</Text>
          </Button>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  title: {
    color: '#132137',
    fontSize: 42,
    textAlign: 'center',
    fontFamily: 'WorkSans-Bold',
    paddingVertical: 16,
    paddingHorizontal: 24,
    lineHeight: 50,
  },
  subtitle: {
    color: '#4A5568',
    textAlign: 'center',
    fontFamily: 'WorkSans-Regular',
    fontSize: 18,
    paddingHorizontal: 32,
    paddingVertical: 16,
    lineHeight: 24,
  },
  footer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: 32,
    paddingHorizontal: 24,
  },
  buttonContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  button: {
    height: 64,
    backgroundColor: '#132137',
    paddingVertical: 20,
    paddingHorizontal: 64,
  },
  buttonText: {
    fontSize: 20,
    fontFamily: 'WorkSans-SemiBold',
    color: 'white',
    letterSpacing: 0.5,
  },
});

export default SplashView;
