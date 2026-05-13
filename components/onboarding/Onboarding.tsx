import { useCallback } from 'react';
import {
  ImageURISource,
  SafeAreaView,
  StyleSheet,
  View,
  ViewToken,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import ListItem from './ListItem';
import PaginationElement from './PaginationElement';
import Button from './Button';

type OnboardingPage = {
  text: string;
  image: ImageURISource;
};

type Props = {
  pages: OnboardingPage[];
  onGetStarted: () => void;
};

const Onboarding = ({ pages, onGetStarted }: Props) => {
  const { width: screenWidth } = useWindowDimensions();
  const x = useSharedValue(0);
  const flatListIndex = useSharedValue(0);
  const flatListRef = useAnimatedRef<Animated.FlatList<OnboardingPage>>();

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems && viewableItems.length > 0 && viewableItems[0]) {
        flatListIndex.value = viewableItems[0].index ?? 0;
      }
    },
    [flatListIndex]
  );

  const scrollHandle = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
  });

  const renderItem = useCallback(
    ({ item, index }: { item: OnboardingPage; index: number }) => {
      return <ListItem item={item} index={index} x={x} />;
    },
    [x]
  );

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        onScroll={scrollHandle}
        horizontal
        scrollEventThrottle={16}
        pagingEnabled={true}
        data={pages}
        keyExtractor={(_, index) => index.toString()}
        bounces={false}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
      />
      <View style={styles.bottomContainer}>
        <PaginationElement length={pages.length} x={x} />
        <Button
          currentIndex={flatListIndex}
          x={x}
          length={pages.length}
          flatListRef={flatListRef}
          screenWidth={screenWidth}
          onGetStarted={onGetStarted}
        />
      </View>
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
});
