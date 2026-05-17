import BottomNavigation from '@/components/bottomNavigation/bottomNavigation';
import { Tabs } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabLayout() {
  return (
    <SafeAreaView className="flex-1">
      <Tabs
        initialRouteName="home"
        tabBar={(props) => <BottomNavigation {...props} />}
        screenOptions={{
          headerShown: false,
        }}>
        <Tabs.Screen name="home" options={{ title: 'Home' }} />
        <Tabs.Screen name="index" options={{ title: 'Index' }} />
        <Tabs.Screen name="history" options={{ title: 'History' }} />
        <Tabs.Screen name="qr" options={{ title: 'QR' }} />
        <Tabs.Screen name="mobile-recharge" options={{ href: null, headerShown: false }} />
        <Tabs.Screen name="dth-recharge" options={{ href: null, headerShown: false }} />
        <Tabs.Screen name="mobile-postpaid" options={{ href: null, headerShown: false }} />
        <Tabs.Screen name="landline" options={{ href: null, headerShown: false }} />
        <Tabs.Screen name="dmt" options={{ href: null, headerShown: false }} />
        <Tabs.Screen name="payout" options={{ href: null, headerShown: false }} />
        <Tabs.Screen name="auto-collect" options={{ href: null, headerShown: false }} />
        <Tabs.Screen name="verification" options={{ href: null, headerShown: false }} />
        <Tabs.Screen name="insurance" options={{ href: null, headerShown: false }} />
        <Tabs.Screen name="gift-card" options={{ href: null, headerShown: false }} />
        <Tabs.Screen name="payment-gateway" options={{ href: null, headerShown: false }} />
        <Tabs.Screen name="settings" options={{ href: null }} />
        <Tabs.Screen name="wallet" options={{ href: null }} />
      </Tabs>
    </SafeAreaView>
  );
}
