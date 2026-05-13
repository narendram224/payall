import IntroductionAnimationScreen from '@/components/onboard/AnimatedScreen';
import { StatusBar } from 'expo-status-bar';

const Board = () => {
  return (
    <>
      <StatusBar style="dark" />
      <IntroductionAnimationScreen />
    </>
  );
};

export default Board;
