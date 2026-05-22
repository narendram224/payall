import { Stack } from 'expo-router';
import AnimatedHeader from './AnimatedHeader';

const PAGE_TITLES: Record<string, string> = {
  'recharge/mobile-recharge': 'Mobile Recharge',
  'recharge/dth-recharge': 'DTH Recharge',
  'recharge/mobile-postpaid': 'Mobile Postpaid',
  'recharge/fastag': 'FASTag',
  'billing/electricity-bill': 'Electricity Bill',
  'billing/landline': 'Landline Bill',
  'billing/verification': 'Aadhaar Verification',
  'billing/water': 'Water',
  'billing/gas': 'Gas Bill',
  'billing/broadband': 'Broadband',
  'billing/cable': 'Cable TV',
  'billing/lpg': 'LPG Gas',
  'billing/all': 'All Bills',
  'billing/credit-card': 'Credit Card Bill',
  'finance/dmt': 'DMT',
  'finance/payout': 'Payout',
  'finance/auto-collect': 'Auto Collect',
  'finance/payment-gateway': 'Payment Gateway',
  'finance/gift-card': 'Gift Card',
  'finance/car-loan': 'Car Loan',
  'finance/emi': 'EMI',
  'finance/gold': 'Gold',
  'finance/silver': 'Silver',
  'finance/loan': 'Instant Loan',
  'finance/postpaid': 'Postpaid',
  'finance/view-all': 'All Finance',
  insurance: 'Insurance',
};

export default function ServicesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" options={{ title: 'Home' }} />

      {/* ── Recharge ── */}
      <Stack.Screen
        name="recharge/mobile-recharge"
        options={{ headerShown: true, header: () => <AnimatedHeader title={PAGE_TITLES['recharge/mobile-recharge']} /> }}
      />
      <Stack.Screen
        name="recharge/dth-recharge"
        options={{ headerShown: true, header: () => <AnimatedHeader title={PAGE_TITLES['recharge/dth-recharge']} /> }}
      />
      <Stack.Screen
        name="recharge/mobile-postpaid"
        options={{ headerShown: true, header: () => <AnimatedHeader title={PAGE_TITLES['recharge/mobile-postpaid']} /> }}
      />
      <Stack.Screen
        name="recharge/fastag"
        options={{ headerShown: true, header: () => <AnimatedHeader title={PAGE_TITLES['recharge/fastag']} /> }}
      />

      {/* ── Billing ── */}
      <Stack.Screen
        name="billing/electricity-bill"
        options={{ headerShown: true, header: () => <AnimatedHeader title={PAGE_TITLES['billing/electricity-bill']} /> }}
      />
      <Stack.Screen
        name="billing/landline"
        options={{ headerShown: true, header: () => <AnimatedHeader title={PAGE_TITLES['billing/landline']} /> }}
      />
      <Stack.Screen
        name="billing/verification"
        options={{ headerShown: true, header: () => <AnimatedHeader title={PAGE_TITLES['billing/verification']} /> }}
      />

      <Stack.Screen
        name="billing/water"
        options={{ headerShown: true, header: () => <AnimatedHeader title={PAGE_TITLES['billing/water']} /> }}
      />
      <Stack.Screen
        name="billing/gas"
        options={{ headerShown: true, header: () => <AnimatedHeader title={PAGE_TITLES['billing/gas']} /> }}
      />
      <Stack.Screen
        name="billing/broadband"
        options={{ headerShown: true, header: () => <AnimatedHeader title={PAGE_TITLES['billing/broadband']} /> }}
      />
      <Stack.Screen
        name="billing/cable"
        options={{ headerShown: true, header: () => <AnimatedHeader title={PAGE_TITLES['billing/cable']} /> }}
      />
      <Stack.Screen
        name="billing/lpg"
        options={{ headerShown: true, header: () => <AnimatedHeader title={PAGE_TITLES['billing/lpg']} /> }}
      />
      <Stack.Screen
        name="billing/all"
        options={{ headerShown: true, header: () => <AnimatedHeader title={PAGE_TITLES['billing/all']} /> }}
      />
      <Stack.Screen
        name="billing/credit-card"
        options={{ headerShown: true, header: () => <AnimatedHeader title={PAGE_TITLES['billing/credit-card']} /> }}
      />

      {/* ── Finance ── */}
      <Stack.Screen
        name="finance/dmt"
        options={{ headerShown: true, header: () => <AnimatedHeader title={PAGE_TITLES['finance/dmt']} /> }}
      />
      <Stack.Screen
        name="finance/payout"
        options={{ headerShown: true, header: () => <AnimatedHeader title={PAGE_TITLES['finance/payout']} /> }}
      />
      <Stack.Screen
        name="finance/auto-collect"
        options={{ headerShown: true, header: () => <AnimatedHeader title={PAGE_TITLES['finance/auto-collect']} /> }}
      />
      <Stack.Screen
        name="finance/payment-gateway"
        options={{ headerShown: true, header: () => <AnimatedHeader title={PAGE_TITLES['finance/payment-gateway']} /> }}
      />
      <Stack.Screen
        name="finance/gift-card"
        options={{ headerShown: true, header: () => <AnimatedHeader title={PAGE_TITLES['finance/gift-card']} /> }}
      />
      <Stack.Screen
        name="finance/car-loan"
        options={{ headerShown: true, header: () => <AnimatedHeader title={PAGE_TITLES['finance/car-loan']} /> }}
      />
      <Stack.Screen
        name="finance/emi"
        options={{ headerShown: true, header: () => <AnimatedHeader title={PAGE_TITLES['finance/emi']} /> }}
      />
      <Stack.Screen
        name="finance/gold"
        options={{ headerShown: true, header: () => <AnimatedHeader title={PAGE_TITLES['finance/gold']} /> }}
      />
      <Stack.Screen
        name="finance/silver"
        options={{ headerShown: true, header: () => <AnimatedHeader title={PAGE_TITLES['finance/silver']} /> }}
      />
      <Stack.Screen
        name="finance/loan"
        options={{ headerShown: true, header: () => <AnimatedHeader title={PAGE_TITLES['finance/loan']} /> }}
      />
      <Stack.Screen
        name="finance/postpaid"
        options={{ headerShown: true, header: () => <AnimatedHeader title={PAGE_TITLES['finance/postpaid']} /> }}
      />
      <Stack.Screen
        name="finance/view-all"
        options={{ headerShown: true, header: () => <AnimatedHeader title={PAGE_TITLES['finance/view-all']} /> }}
      />

      {/* ── Insurance ── */}
      <Stack.Screen
        name="insurance"
        options={{ headerShown: true, header: () => <AnimatedHeader title={PAGE_TITLES.insurance} /> }}
      />
      <Stack.Screen
        name="insurance/bike"
        options={{ headerShown: true, header: () => <AnimatedHeader title="Bike Insurance" /> }}
      />
      <Stack.Screen
        name="insurance/car"
        options={{ headerShown: true, header: () => <AnimatedHeader title="Car Insurance" /> }}
      />
      <Stack.Screen
        name="insurance/health"
        options={{ headerShown: true, header: () => <AnimatedHeader title="Health Insurance" /> }}
      />
      <Stack.Screen
        name="insurance/life"
        options={{ headerShown: true, header: () => <AnimatedHeader title="Life Insurance" /> }}
      />
      <Stack.Screen
        name="insurance/all"
        options={{ headerShown: true, header: () => <AnimatedHeader title="All Insurance" /> }}
      />
    </Stack>
  );
}
