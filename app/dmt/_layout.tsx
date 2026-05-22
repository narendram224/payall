import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AnimatedHeader from '../services/AnimatedHeader';

const PAGE_TITLES: Record<string, string> = {
  'dmt/index': 'Direct Money Transfer',
  'dmt/add-sender': 'Register Sender',
  'dmt/verify-sender': 'Verify Sender',
  'dmt/beneficiaries': 'Beneficiaries',
};

export default function DMTLayout() {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: true,
            header: () => <AnimatedHeader title={PAGE_TITLES['dmt/index']} />,
          }}
        />
        <Stack.Screen
          name="add-sender"
          options={{
            headerShown: true,
            header: () => <AnimatedHeader title={PAGE_TITLES['dmt/add-sender']} />,
          }}
        />
        <Stack.Screen
          name="verify-sender"
          options={{
            headerShown: true,
            header: () => <AnimatedHeader title={PAGE_TITLES['dmt/verify-sender']} />,
          }}
        />
        <Stack.Screen
          name="beneficiaries"
          options={{
            headerShown: true,
            header: () => <AnimatedHeader title={PAGE_TITLES['dmt/beneficiaries']} />,
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
