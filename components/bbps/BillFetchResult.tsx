import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, User, IndianRupee, Clock } from 'lucide-react-native';

interface BillData {
  billAmount: string;
  dueDate?: string;
  billDate?: string;
  customerName?: string;
  billerResponse?: Record<string, string>;
}

interface BillFetchResultProps {
  billerName: string;
  consumerNumber: string;
  bill: BillData;
}

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <View className="mb-3 flex-row items-center justify-between">
    <View className="flex-row items-center gap-2">
      {icon}
      <Text className="text-sm text-muted-foreground">{label}</Text>
    </View>
    <Text className="text-sm font-semibold text-foreground">{value}</Text>
  </View>
);

const BillFetchResult: React.FC<BillFetchResultProps> = ({ billerName, consumerNumber, bill }) => {
  const reducedMotion = useReducedMotion();

  const isDue = bill.dueDate
    ? new Date(bill.dueDate) < new Date()
    : false;

  return (
    <Animated.View
      entering={reducedMotion ? undefined : FadeInDown.duration(350)}
      className="overflow-hidden rounded-2xl"
    >
      {/* Gradient Header */}
      <LinearGradient
        colors={isDue ? ['#ef4444', '#dc2626'] : ['#3b82f6', '#6366f1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-5 py-5"
      >
        <Text className="mb-1 text-xs font-medium uppercase tracking-wider text-white/70">
          {billerName}
        </Text>
        <Text className="text-4xl font-bold text-white">
          ₹{parseFloat(bill.billAmount || '0').toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </Text>
        {isDue && (
          <View className="mt-2 self-start rounded-full bg-white/20 px-2.5 py-0.5">
            <Text className="text-xs font-semibold text-white">OVERDUE</Text>
          </View>
        )}
      </LinearGradient>

      {/* Details Card */}
      <View className="rounded-b-2xl border border-border bg-card px-5 py-4">
        {bill.customerName && (
          <InfoRow
            icon={<User size={15} color="#6b7280" />}
            label="Consumer"
            value={bill.customerName}
          />
        )}
        <InfoRow
          icon={<IndianRupee size={15} color="#6b7280" />}
          label="Consumer No."
          value={consumerNumber}
        />
        {bill.dueDate && (
          <InfoRow
            icon={<Calendar size={15} color={isDue ? '#ef4444' : '#6b7280'} />}
            label="Due Date"
            value={bill.dueDate}
          />
        )}
        {bill.billDate && (
          <InfoRow
            icon={<Clock size={15} color="#6b7280" />}
            label="Bill Date"
            value={bill.billDate}
          />
        )}

        {/* Extra params from billerResponse */}
        {bill.billerResponse &&
          Object.entries(bill.billerResponse)
            .filter(([key]) => !['billAmount', 'dueDate', 'billDate', 'customerName'].includes(key))
            .slice(0, 3)
            .map(([key, value]) => (
              <InfoRow
                key={key}
                icon={<View className="h-3.5 w-3.5 rounded-full bg-muted" />}
                label={key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                value={String(value)}
              />
            ))}
      </View>
    </Animated.View>
  );
};

export default BillFetchResult;
