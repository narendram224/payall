import { View, ScrollView } from 'react-native';
import { Text } from '../../components/ui/text';
import { Button } from '../../components/ui/button';
import { useTheme } from '../../context/ThemeContext';
import { TrendingUp, TrendingDown, Calendar, Filter } from 'lucide-react-native';

export default function HistoryScreen() {
  const { theme } = useTheme();

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
      className="flex-1">
      <View className="space-y-6 p-6">
        {/* Header Stats */}
        <View className="space-y-4">
          <View className="flex-row justify-between">
            <View
              className="mr-2 flex-1 rounded-xl p-4"
              style={{ backgroundColor: theme.colors.card }}>
              <View className="flex-row items-center gap-2">
                <TrendingUp size={16} color={theme.colors.success} />
                <Text variant="muted" className="text-sm">
                  Income
                </Text>
              </View>
              <Text className="mt-1 text-xl font-bold text-green-600">+₹3,500</Text>
              <Text variant="muted" className="text-xs">
                This month
              </Text>
            </View>
            <View
              className="ml-2 flex-1 rounded-xl p-4"
              style={{ backgroundColor: theme.colors.card }}>
              <View className="flex-row items-center gap-2">
                <TrendingDown size={16} color={theme.colors.destructive} />
                <Text variant="muted" className="text-sm">
                  Expenses
                </Text>
              </View>
              <Text className="mt-1 text-xl font-bold text-red-600">-₹2,200</Text>
              <Text variant="muted" className="text-xs">
                This month
              </Text>
            </View>
          </View>
        </View>

        {/* Filter Options */}
        <View className="flex-row gap-3">
          <Button variant="outline" className="flex-row items-center gap-2 px-4 py-2">
            <Calendar size={16} color={theme.colors.primary} />
            <Text className="text-sm">This Month</Text>
          </Button>
          <Button variant="outline" className="flex-row items-center gap-2 px-4 py-2">
            <Filter size={16} color={theme.colors.primary} />
            <Text className="text-sm">All Types</Text>
          </Button>
        </View>

        {/* Transaction History */}
        <View className="space-y-3">
          <Text variant="h3" className="text-lg font-semibold">
            Transaction History
          </Text>
          <View className="space-y-3">
            {/* Today */}
            <View className="space-y-2">
              <Text variant="muted" className="text-sm font-medium">
                Today
              </Text>

              <View
                className="flex-row items-center justify-between rounded-lg p-4"
                style={{ backgroundColor: theme.colors.card }}>
                <View className="flex-row items-center gap-3">
                  <View
                    className="h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: theme.colors.success + '20' }}>
                    <TrendingUp size={20} color={theme.colors.success} />
                  </View>
                  <View>
                    <Text className="font-medium">Salary Credit</Text>
                    <Text variant="muted" className="text-sm">
                      10:30 AM • Bank Transfer
                    </Text>
                  </View>
                </View>
                <Text className="font-semibold text-green-600">+₹25,000</Text>
              </View>

              <View
                className="flex-row items-center justify-between rounded-lg p-4"
                style={{ backgroundColor: theme.colors.card }}>
                <View className="flex-row items-center gap-3">
                  <View
                    className="h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: theme.colors.destructive + '20' }}>
                    <TrendingDown size={20} color={theme.colors.destructive} />
                  </View>
                  <View>
                    <Text className="font-medium">Grocery Shopping</Text>
                    <Text variant="muted" className="text-sm">
                      2:15 PM • Big Bazaar
                    </Text>
                  </View>
                </View>
                <Text className="font-semibold text-red-600">-₹850</Text>
              </View>

              <View
                className="flex-row items-center justify-between rounded-lg p-4"
                style={{ backgroundColor: theme.colors.card }}>
                <View className="flex-row items-center gap-3">
                  <View
                    className="h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: theme.colors.success + '20' }}>
                    <TrendingUp size={20} color={theme.colors.success} />
                  </View>
                  <View>
                    <Text className="font-medium">Money Received</Text>
                    <Text variant="muted" className="text-sm">
                      5:45 PM • From Priya
                    </Text>
                  </View>
                </View>
                <Text className="font-semibold text-green-600">+₹1,200</Text>
              </View>
            </View>

            {/* Yesterday */}
            <View className="space-y-2">
              <Text variant="muted" className="text-sm font-medium">
                Yesterday
              </Text>

              <View
                className="flex-row items-center justify-between rounded-lg p-4"
                style={{ backgroundColor: theme.colors.card }}>
                <View className="flex-row items-center gap-3">
                  <View
                    className="h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: theme.colors.destructive + '20' }}>
                    <TrendingDown size={20} color={theme.colors.destructive} />
                  </View>
                  <View>
                    <Text className="font-medium">Mobile Recharge</Text>
                    <Text variant="muted" className="text-sm">
                      11:20 AM • Jio Prepaid
                    </Text>
                  </View>
                </View>
                <Text className="font-semibold text-red-600">-₹299</Text>
              </View>

              <View
                className="flex-row items-center justify-between rounded-lg p-4"
                style={{ backgroundColor: theme.colors.card }}>
                <View className="flex-row items-center gap-3">
                  <View
                    className="h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: theme.colors.destructive + '20' }}>
                    <TrendingDown size={20} color={theme.colors.destructive} />
                  </View>
                  <View>
                    <Text className="font-medium">Electricity Bill</Text>
                    <Text variant="muted" className="text-sm">
                      4:30 PM • BSES Rajdhani
                    </Text>
                  </View>
                </View>
                <Text className="font-semibold text-red-600">-₹1,500</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Load More */}
        <Button variant="outline" className="p-4">
          <Text>Load More Transactions</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
