import { View, Text, ScrollView } from 'react-native';

const serviceCategories = [
  {
    title: 'Recharge',
    items: [
      { icon: '📱', label: 'Mobile Recharge', route: '/services/recharge/mobile-recharge' },
      { icon: '📺', label: 'DTH Recharge', route: '/services/recharge/dth-recharge' },
      { icon: '💳', label: 'Postpaid', route: '/services/recharge/mobile-postpaid' },
    ],
  },
  {
    title: 'Bills',
    items: [
      { icon: '⚡', label: 'Electricity', route: '/services/billing/electricity-bill' },
      { icon: '📞', label: 'Landline', route: '/services/billing/landline' },
      { icon: '🪪', label: 'Aadhaar Verify', route: '/services/billing/verification' },
    ],
  },
  {
    title: 'Finance',
    items: [
      { icon: '💸', label: 'DMT', route: '/services/finance/dmt' },
      { icon: '🏦', label: 'Payout', route: '/services/finance/payout' },
      { icon: '🔄', label: 'Auto Collect', route: '/services/finance/auto-collect' },
      { icon: '💳', label: 'Payment Gateway', route: '/services/finance/payment-gateway' },
      { icon: '🎁', label: 'Gift Card', route: '/services/finance/gift-card' },
    ],
  },
  {
    title: 'Insurance',
    items: [
      { icon: '🛵', label: 'Bike', route: '/services/insurance' },
      { icon: '🚗', label: 'Car', route: '/services/insurance' },
      { icon: '🏥', label: 'Health', route: '/services/insurance' },
      { icon: '🛡️', label: 'Life', route: '/services/insurance' },
    ],
  },
];

export default function ServicesHomeScreen() {
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4 pt-2">
        <Text className="mb-4 text-lg font-bold text-foreground">All Services</Text>

        {serviceCategories.map((category, catIdx) => (
          <View key={catIdx} className="mb-6">
            <Text className="mb-3 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
              {category.title}
            </Text>
            <View className="rounded-2xl bg-card border border-border overflow-hidden">
              {category.items.map((item, itemIdx) => (
                <View
                  key={itemIdx}
                  className={[
                    'flex-row items-center justify-between p-4',
                    itemIdx !== category.items.length - 1 && 'border-b border-border',
                  ].join(' ')}>
                  <View className="flex-row items-center gap-3">
                    <View className="h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                      <Text className="text-lg">{item.icon}</Text>
                    </View>
                    <Text className="text-base font-medium text-foreground">{item.label}</Text>
                  </View>
                  <View className="h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <Text className="text-xs text-muted-foreground">›</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
