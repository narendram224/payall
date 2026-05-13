import { View, ScrollView } from 'react-native';
import { Text } from '../../components/ui/text';
import { Button } from '../../components/ui/button';
import { useTheme } from '../../context/ThemeContext';
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react-native';

export default function WalletScreen() {
  const { theme, colorScheme } = useTheme();

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
      className="flex-1">
      <View className="space-y-6 p-6">
        {/* Wallet Balance Card */}
        <View
          className="rounded-2xl p-6"
          style={{
            backgroundColor: theme.colors.primary,
            shadowColor: colorScheme === 'dark' ? '#000' : '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 8,
          }}>
          <View className="items-center space-y-4">
            <Wallet size={48} color="#ffffff" />
            <Text className="text-center text-lg font-medium text-white">Total Balance</Text>
            <Text className="text-center text-4xl font-bold text-white">₹12,450.00</Text>
            <Text className="text-center text-sm text-white/80">Last updated: 2 mins ago</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="space-y-3">
          <Text variant="h3" className="text-lg font-semibold">
            Quick Actions
          </Text>
          <View className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="flex-row items-center justify-center gap-2 p-4">
              <ArrowUpRight size={20} color={theme.colors.primary} />
              <Text>Send Money</Text>
            </Button>
            <Button variant="outline" className="flex-row items-center justify-center gap-2 p-4">
              <ArrowDownRight size={20} color={theme.colors.primary} />
              <Text>Request</Text>
            </Button>
          </View>
        </View>

        {/* Recent Transactions */}
        <View className="space-y-3">
          <Text variant="h3" className="text-lg font-semibold">
            Recent Transactions
          </Text>
          <View className="space-y-3">
            <View
              className="flex-row items-center justify-between rounded-lg p-4"
              style={{ backgroundColor: theme.colors.card }}>
              <View className="flex-row items-center gap-3">
                <View
                  className="h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: theme.colors.success }}>
                  <ArrowDownRight size={20} color="#ffffff" />
                </View>
                <View>
                  <Text className="font-medium">Received from John</Text>
                  <Text variant="muted" className="text-sm">
                    Today, 2:30 PM
                  </Text>
                </View>
              </View>
              <Text className="font-semibold text-green-600">+₹500.00</Text>
            </View>

            <View
              className="flex-row items-center justify-between rounded-lg p-4"
              style={{ backgroundColor: theme.colors.card }}>
              <View className="flex-row items-center gap-3">
                <View
                  className="h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: theme.colors.destructive }}>
                  <ArrowUpRight size={20} color="#ffffff" />
                </View>
                <View>
                  <Text className="font-medium">Sent to Sarah</Text>
                  <Text variant="muted" className="text-sm">
                    Yesterday, 10:15 AM
                  </Text>
                </View>
              </View>
              <Text className="font-semibold text-red-600">-₹200.00</Text>
            </View>

            <View
              className="flex-row items-center justify-between rounded-lg p-4"
              style={{ backgroundColor: theme.colors.card }}>
              <View className="flex-row items-center gap-3">
                <View
                  className="h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: theme.colors.success }}>
                  <TrendingUp size={20} color="#ffffff" />
                </View>
                <View>
                  <Text className="font-medium">Cashback Earned</Text>
                  <Text variant="muted" className="text-sm">
                    2 days ago
                  </Text>
                </View>
              </View>
              <Text className="font-semibold text-green-600">+₹25.00</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
