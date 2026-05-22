import React, { useState } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Text } from '../../components/ui/text';
import { useTheme } from '../../context/ThemeContext';
import {
  Search,
  SlidersHorizontal,
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
  HelpCircle,
  Landmark,
  Building2,
  Gift,
  CreditCard,
  CheckCircle2,
  ChevronDown,
  Filter,
} from 'lucide-react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomSheet } from '../../components/ui/BottomSheet';

const screenWidth = Dimensions.get('window').width;

const WaveBackground = () => (
  <View className="absolute left-0 right-0 top-0 h-[300px] opacity-20" pointerEvents="none">
    <Svg height="100%" width="100%" viewBox="0 0 1440 320" preserveAspectRatio="none">
      <Defs>
        <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#6366f1" stopOpacity="0.4" />
          <Stop offset="1" stopColor="#1e1b4b" stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Path
        fill="url(#grad)"
        d="M0,160L48,170.7C96,181,192,203,288,208C384,213,480,203,576,176C672,149,768,107,864,101.3C960,96,1056,128,1152,144C1248,160,1344,160,1392,160L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
      />
    </Svg>
  </View>
);

type TransactionType = 'send' | 'received' | 'recharge' | 'cashback';
type TransactionStatus = 'success' | 'failed' | 'pending';

interface Transaction {
  id: string;
  title: string;
  date: string;
  month: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  method: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    title: 'BMTC BUS KA51AJ8584',
    date: '12 May',
    month: 'MAY 2026',
    amount: 24,
    type: 'send',
    status: 'success',
    method: 'SBI',
  },
  {
    id: '2',
    title: 'BMTC BUS KA57F1099',
    date: '12 May',
    month: 'MAY 2026',
    amount: 290,
    type: 'send',
    status: 'success',
    method: 'HDFC',
  },
  {
    id: '3',
    title: 'Transfer to ******2033',
    date: '11 May',
    month: 'MAY 2026',
    amount: 7000,
    type: 'send',
    status: 'success',
    method: 'SBI',
  },
  {
    id: '4',
    title: 'Transfer to ******7132',
    date: '07 May',
    month: 'MAY 2026',
    amount: 15000,
    type: 'send',
    status: 'success',
    method: 'ICICI',
  },
  {
    id: '5',
    title: 'TANISHQ BHS',
    date: '05 May',
    month: 'MAY 2026',
    amount: 9649,
    type: 'send',
    status: 'success',
    method: 'SBI',
  },
  {
    id: '6',
    title: 'Salary from Acme Corp',
    date: '01 May',
    month: 'MAY 2026',
    amount: 85000,
    type: 'received',
    status: 'success',
    method: 'SBI',
  },
  {
    id: '7',
    title: 'Jio Prepaid Recharge',
    date: '28 Apr',
    month: 'APR 2026',
    amount: 299,
    type: 'recharge',
    status: 'success',
    method: 'SBI',
  },
  {
    id: '8',
    title: 'Amazon Cashback',
    date: '25 Apr',
    month: 'APR 2026',
    amount: 50,
    type: 'cashback',
    status: 'success',
    method: 'Wallet',
  },
];

const FilterChip = ({
  label,
  selected,
  onPress,
  icon,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: React.ReactNode;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`mr-2 flex-row items-center rounded-full border px-4 py-2 ${selected ? 'border-[#6366f1] bg-[#6366f120]' : 'border-[#374151] bg-[#2d2d2d]'}`}>
    {icon && <View className="mr-1">{icon}</View>}
    <Text
      className={`text-xs font-medium uppercase tracking-wider ${selected ? 'text-[#6366f1]' : 'text-[#9ca3af]'}`}>
      {label}
    </Text>
    {!icon && <ChevronDown size={14} color={selected ? '#6366f1' : '#9ca3af'} className="ml-1" />}
  </TouchableOpacity>
);

const getBankIcon = (method: string) => {
  if (method === 'SBI') return <Landmark size={12} color="#fff" />;
  if (method === 'HDFC') return <Building2 size={12} color="#fff" />;
  if (method === 'ICICI') return <CreditCard size={12} color="#fff" />;
  return <Landmark size={12} color="#fff" />;
};

const getTxIcon = (type: string, method: string) => {
  if (type === 'send' && (method === 'SBI' || method === 'HDFC' || method === 'ICICI')) {
    return <Landmark size={24} color="#3b82f6" />;
  }
  switch (type) {
    case 'send':
      return <ArrowUpRight size={22} color="#ef4444" />;
    case 'received':
      return <ArrowDownLeft size={22} color="#22c55e" />;
    case 'recharge':
      return <Receipt size={22} color="#f59e0b" />;
    case 'cashback':
      return <Gift size={22} color="#8b5cf6" />;
    default:
      return <Receipt size={22} color="#6b7280" />;
  }
};

export default function HistoryScreen() {
  const { theme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const categories = ['All', 'Send', 'Received', 'Recharge', 'Cashback'];
  const months = ['All', 'MAY 2026', 'APR 2026'];
  const statuses = ['All', 'Success', 'Pending', 'Failed'];

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempMonth, setTempMonth] = useState('All');
  const [tempCategory, setTempCategory] = useState('All');
  const [tempStatus, setTempStatus] = useState('All');

  const openFilters = () => {
    setTempMonth(selectedMonth);
    setTempCategory(selectedCategory);
    setTempStatus(selectedStatus);
    setIsFilterOpen(true);
  };

  const applyFilters = () => {
    setSelectedMonth(tempMonth);
    setSelectedCategory(tempCategory);
    setSelectedStatus(tempStatus);
    setIsFilterOpen(false);
  };

  const filteredTransactions = MOCK_TRANSACTIONS.filter((tx) => {
    const matchesSearch = tx.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMonth = selectedMonth === 'All' || tx.month === selectedMonth;
    const matchesCategory =
      selectedCategory === 'All' || tx.type === selectedCategory.toLowerCase();
    const matchesStatus = selectedStatus === 'All' || tx.status === selectedStatus.toLowerCase();
    return matchesSearch && matchesMonth && matchesCategory && matchesStatus;
  });

  const groupedTransactions = filteredTransactions.reduce(
    (acc, tx) => {
      if (!acc[tx.month]) acc[tx.month] = [];
      acc[tx.month].push(tx);
      return acc;
    },
    {} as Record<string, typeof MOCK_TRANSACTIONS>
  );

  // Chart Data
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        data: [2000, 4500, 2800, 8000, 5200],
        color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, // Green for Income
        strokeWidth: 2,
      },
      {
        data: [1000, 3000, 2000, 5000, 3000],
        color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`, // Red for Expense
        strokeWidth: 2,
      },
    ],
    legend: ['Income', 'Expense'],
  };

  return (
    <SafeAreaView
      edges={['top']}
      className="flex-1"
      style={{ backgroundColor: theme.colors.background }}>
      <WaveBackground />

      <View className="mx-4 flex flex-row items-center justify-between">
        <Text className="text-2xl font-semibold">History</Text>
        <TouchableOpacity>
          <HelpCircle size={24} color="red" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View className="mx-4 mt-4 flex-row items-center rounded-full border border-[#3f3f46] bg-background px-4 py-3">
          <Search size={20} color="#9ca3af" />
          <TextInput
            className="ml-3 flex-1 p-0 text-base text-white "
            placeholder="Search transactions"
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ height: Platform.OS === 'ios' ? 24 : 'auto' }}
          />
          <View className="ml-2 h-6 w-[1px] bg-[#4b5563]" />
          <TouchableOpacity className="ml-3 pl-1">
            <SlidersHorizontal size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Filter Chips */}
        <View className="mb-2 mt-5">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4"
            contentContainerStyle={{ paddingRight: 32 }}>
            <FilterChip
              label="Filter"
              selected={false}
              onPress={openFilters}
              icon={<Filter size={14} color="#6b7280" />}
            />
            {categories.map((cat) => (
              <FilterChip
                key={cat}
                label={cat}
                selected={selectedCategory === cat}
                onPress={() => setSelectedCategory(cat)}
              />
            ))}
            {months.map((m) => (
              <FilterChip
                key={m}
                label={m}
                selected={selectedMonth === m}
                onPress={() => setSelectedMonth(m)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Analytics Chart */}
        <View className="mx-4 mb-2 mt-6">
          <Text className="mb-4 text-lg font-medium text-white">Analytics Overview</Text>
          <LineChart
            data={chartData}
            width={screenWidth - 32}
            height={180}
            chartConfig={{
              backgroundColor: '#1e1b4b',
              backgroundGradientFrom: '#1e1b4b',
              backgroundGradientTo: '#3730a3',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: { r: '4', strokeWidth: '2', stroke: '#1c1c1e' },
            }}
            bezier
            style={{ borderRadius: 16 }}
          />
        </View>

        {/* Transactions List */}
        <View className="mt-4 px-4 pb-20">
          {Object.keys(groupedTransactions).map((month) => (
            <View key={month} className="mb-6">
              <Text className="mb-2 text-xs font-bold uppercase tracking-[0.1em] text-[#9ca3af]">
                {month.replace(' 20', " '")}
              </Text>

              <View>
                {groupedTransactions[month].map((tx, index) => (
                  <View
                    key={tx.id}
                    className={`flex-row items-center justify-between py-4 ${index !== groupedTransactions[month].length - 1 ? 'border-b border-dashed border-[#374151]' : ''}`}>
                    <View className="flex-1 flex-row items-center pr-4">
                      <View
                        className={`mr-4 h-12 w-12 items-center justify-center rounded-full border border-[#374151] bg-[#1f2937]`}>
                        {getTxIcon(tx.type, tx.method)}
                      </View>
                      <View className="flex-1">
                        <Text className="text-[15px] font-medium text-white" numberOfLines={1}>
                          {tx.title}
                        </Text>
                        <View className="mt-1 flex-row items-center">
                          <CheckCircle2 size={14} color="#22c55e" className="mr-1.5" />
                          <Text className="text-[13px] text-[#9ca3af]">{tx.date}</Text>
                        </View>
                        {tx.method === 'HDFC' && tx.amount > 200 && (
                          <View className="mt-2 self-start rounded bg-green-900/30 px-2 py-1">
                            <Text className="text-[10px] font-bold uppercase tracking-wider text-green-400">
                              COMPLETED WITHIN 8 SECONDS
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <View className="items-end pl-2">
                      <Text className={`text-[15px] font-semibold text-white`}>
                        ₹
                        {tx.amount.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}

          {Object.keys(groupedTransactions).length === 0 && (
            <View className="items-center justify-center py-10">
              <Text className="text-base text-[#9ca3af]">No transactions found</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <BottomSheet isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
        <View className="mb-2">
          <Text className="mb-6 text-xl font-bold text-white">Filters</Text>

          <Text className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#9ca3af]">
            Category
          </Text>
          <View className="mb-5 flex-row flex-wrap">
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setTempCategory(cat)}
                className={`mb-3 mr-3 rounded-full border px-4 py-2 ${tempCategory === cat ? 'border-[#6366f1] bg-[#6366f120]' : 'border-[#374151] bg-[#2d2d2d]'}`}>
                <Text
                  className={`text-sm font-medium ${tempCategory === cat ? 'text-[#6366f1]' : 'text-[#9ca3af]'}`}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#9ca3af]">
            Month
          </Text>
          <View className="mb-5 flex-row flex-wrap">
            {months.map((m) => (
              <TouchableOpacity
                key={m}
                onPress={() => setTempMonth(m)}
                className={`mb-3 mr-3 rounded-full border px-4 py-2 ${tempMonth === m ? 'border-[#6366f1] bg-[#6366f120]' : 'border-[#374151] bg-[#2d2d2d]'}`}>
                <Text
                  className={`text-sm font-medium ${tempMonth === m ? 'text-[#6366f1]' : 'text-[#9ca3af]'}`}>
                  {m}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#9ca3af]">
            Status
          </Text>
          <View className="mb-8 flex-row flex-wrap">
            {statuses.map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => setTempStatus(s)}
                className={`mb-3 mr-3 rounded-full border px-4 py-2 ${tempStatus === s ? 'border-[#6366f1] bg-[#6366f120]' : 'border-[#374151] bg-[#2d2d2d]'}`}>
                <Text
                  className={`text-sm font-medium ${tempStatus === s ? 'text-[#6366f1]' : 'text-[#9ca3af]'}`}>
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="mt-2 flex-row items-center justify-between">
            <TouchableOpacity
              className="mr-2 flex-1 items-center rounded-xl border border-gray-300 py-3.5"
              onPress={() => {
                setTempCategory('All');
                setTempMonth('All');
                setTempStatus('All');
              }}>
              <Text className="text-base font-semibold text-gray-700">Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="ml-2 flex-1 items-center rounded-xl bg-blue-500 py-3.5"
              onPress={applyFilters}>
              <Text className="text-base font-semibold text-white">Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}
