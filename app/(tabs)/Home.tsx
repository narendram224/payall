import {
  FINANCESection,
  RechargeSection,
  InsuranceSection,
} from '@/components/home/HomePageConfiguration';
import ParallaxHeader from '@/components/home/ParallaxHeader';
import { Text, ScrollView, Image } from 'react-native';
import PageLayout from '@/components/layout/PageLayout';
import { Icon } from 'lucide-react-native';
import CardSection from '@/components/home/CardSection';

const Home = () => {
  const rechargeSection = RechargeSection.map((item) => ({
    ...item,
    icon: <Image source={item.icon} style={{ width: 24, height: 24 }} className="rounded-full" />,
  }));

  const financeSection = FINANCESection.map((item) => ({
    ...item,
    icon: <Image source={item.icon} style={{ width: 24, height: 24 }} className="rounded-full" />,
  }));

  const insuranceSection = InsuranceSection.map((item) => ({
    ...item,
    icon: <Image source={item.icon} style={{ width: 24, height: 24 }} className="rounded-full" />,
  }));

  return (
    <ParallaxHeader>
      <ScrollView>
        <CardSection title="Recharge Section" iconTextItems={rechargeSection} />
        <CardSection title="Finance Section" iconTextItems={financeSection} />
        <CardSection title="Finance Section" iconTextItems={financeSection} />
        <CardSection title="Finance Section" iconTextItems={financeSection} />
        <CardSection title="Finance Section" iconTextItems={financeSection} />
        <CardSection title="Finance Section" iconTextItems={financeSection} />
        <CardSection title="Finance Section" iconTextItems={financeSection} />
        <CardSection title="Finance Section" iconTextItems={financeSection} />

        <CardSection title="Insurance Section" iconTextItems={insuranceSection} />
      </ScrollView>
    </ParallaxHeader>
  );
};

export default Home;
