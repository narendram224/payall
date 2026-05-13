import { StyleSheet, View, useWindowDimensions } from 'react-native';
import React from 'react';
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { SharedValue } from 'react-native-reanimated/lib/typescript/commonTypes';

type PaginationItemProps = {
  index: number;
  x: SharedValue<number>;
  screenWidth: number;
};

const PaginationItem = ({ index, x, screenWidth }: PaginationItemProps) => {
  const itemRnStyle = useAnimatedStyle(() => {
    const width = interpolate(
      x.value,
      [(index - 1) * screenWidth, index * screenWidth, (index + 1) * screenWidth],
      [35, 16, 35],
      Extrapolate.CLAMP
    );
    const bgColor = interpolateColor(
      x.value,
      [(index - 1) * screenWidth, index * screenWidth, (index + 1) * screenWidth],
      ['#D0D0D0', '#304FFE', '#D0D0D0']
    );

    return {
      width,
      backgroundColor: bgColor,
    };
  }, [index, screenWidth, x]);

  return <Animated.View style={[styles.itemStyle, itemRnStyle]} />;
};

type Props = {
  length: number;
  x: SharedValue<number>;
  currentIndex?: SharedValue<number>;
};

const PaginationElement = ({ length, x, currentIndex }: Props) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  return (
    <View style={styles.container}>
      {Array.from({ length }).map((_, index) => {
        return <PaginationItem key={index} index={index} x={x} screenWidth={SCREEN_WIDTH} />;
      })}
    </View>
  );
};

export default PaginationElement;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemStyle: {
    width: 35,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});
