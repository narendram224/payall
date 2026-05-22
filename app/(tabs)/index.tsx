import {
  FINANCESection,
  RechargeSection,
  InsuranceSection,
  BillPaySection,
} from '@/components/home/HomePageConfiguration';
import ParallaxHeader from '@/components/home/ParallaxHeader';
import CardSection from '@/components/home/CardSection';
import { Image } from 'expo-image';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ExclusiveOffer from '@/components/home/ExclusiveOffer';
import ActionButtons from '@/components/home/ActionButtons';
import MiniBalance from '@/components/home/MiniBalance';

const CustomIcon = ({ uri }: { uri: string }) => {
  return <Image source={uri} style={{ width: 40, height: 40 }} contentFit="cover" />;
};

const Home = () => {
  const rechargeSection = RechargeSection.map((item) => ({
    ...item,
    icon: <CustomIcon uri={item.icon} />,
  }));

  const financeSection = FINANCESection.map((item) => ({
    ...item,
    icon: <Image source={item.icon} style={{ width: 24, height: 24 }} className="rounded-full" />,
  }));

  const insuranceSection = InsuranceSection.map((item) => ({
    ...item,
    icon: <Image source={item.icon} style={{ width: 24, height: 24 }} className="rounded-full" />,
  }));

  const billPaySection = BillPaySection.map((item) => ({
    ...item,
    icon: <Image source={item.icon} style={{ width: 24, height: 24 }} className="rounded-full" />,
  }));

  return (
    <ParallaxHeader>
      <View style={{ paddingVertical: 16 }}>
        <MiniBalance />
        <ActionButtons />
      </View>

      <CardSection title="Recharge" iconTextItems={rechargeSection} />
      <CardSection title="Bills" iconTextItems={billPaySection} />

      <LinearGradient
        colors={['#FFA585', '#FFEDA0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="m-4 p-4">
        <ExclusiveOffer />
      </LinearGradient>

      <CardSection title="Finance" iconTextItems={financeSection} />

      <LinearGradient
        colors={['#0C0C0C', '#0F971C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="m-4 p-4">
        <ExclusiveOffer />
      </LinearGradient>

      <CardSection title="Insurance" iconTextItems={insuranceSection} />
    </ParallaxHeader>
  );
};

export default Home;
