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
import BalanceCard from '@/components/home/BalanceCard';
import { LinearGradient } from 'expo-linear-gradient';
import ExclusiveOffer from '@/components/home/ExclusiveOffer';
import ActionButtons from '@/components/home/ActionButtons';

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
        <ActionButtons />
      </View>
      <CardSection title="Recharge Section" iconTextItems={rechargeSection} />
      <CardSection title="Bill Pay" iconTextItems={billPaySection} />
      <CardSection title="Finance Section" iconTextItems={financeSection} />
      <LinearGradient
        colors={['#FFA585', '#FFEDA0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="m-4 p-4 ">
        <ExclusiveOffer />
      </LinearGradient>
      <CardSection title="Finance Section" iconTextItems={financeSection} />

      <LinearGradient
        colors={['#0C0C0C', '#0F971C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="m-4 p-4 ">
        <ExclusiveOffer />
      </LinearGradient>

      <CardSection title="Finance Section" iconTextItems={financeSection} />
      <CardSection title="Finance Section" iconTextItems={financeSection} />
      <LinearGradient
        colors={['#bcf4ffff', '#657effff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="m-4 p-4 ">
        <ExclusiveOffer />
      </LinearGradient>
      <CardSection title="Finance Section" iconTextItems={financeSection} />
      <LinearGradient
        colors={['#1A2766', '#AE1B1E', '#FC9F32']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="m-4 p-4 ">
        <ExclusiveOffer />
      </LinearGradient>
      <CardSection title="Finance Section" iconTextItems={financeSection} />
      <CardSection title="Finance Section" iconTextItems={financeSection} />
      <CardSection title="Finance Section" iconTextItems={financeSection} />
      <LinearGradient
        colors={['#f70394ff', '#1b09ffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="m-4 p-4 ">
        <ExclusiveOffer />
      </LinearGradient>

      <CardSection title="Insurance Section" iconTextItems={insuranceSection} />
    </ParallaxHeader>
  );
};

export default Home;
