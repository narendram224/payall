import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Pressable,
  TextInput,
  ScrollView,
} from 'react-native';
import { Text } from '@/components/ui/text';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, useReducedMotion } from 'react-native-reanimated';
import {
  CheckCircle2,
  Phone,
  ShieldCheck,
  Sparkles,
  Zap,
  History,
  Search,
  RefreshCw,
  Users,
  ShieldAlert,
  Check,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FlashList } from '@shopify/flash-list';
import OperatorSelector from '@/components/recharge/OperatorSelector';
import AmountInput from '@/components/recharge/AmountInput';
import TransactionSummary from '@/components/recharge/TransactionSummary';
import SuccessScreen from '@/components/recharge/SuccessScreen';
import { rechargeService } from '@/services/recharge/recharge.service';
import { Provider } from '@/services/recharge/recharge.dto';
import { useDeviceContacts } from '@/hooks/useDeviceContacts';
import * as Contacts from 'expo-contacts';
import { toast } from 'react-native-sonner';

const BENEFITS = [
  'Instant processing under 5 seconds',
  'All major operators supported natively',
  'Guaranteed cashbacks into active wallet',
  'Securely encrypted routing protection',
];

const RECENT_RECHARGES = [
  { number: '9876543210', operator: 'Jio', amount: '₹299' },
  { number: '8765432109', operator: 'Airtel', amount: '₹179' },
];

const MobileRecharge = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<Provider | null>(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionResult, setTransactionResult] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const reducedMotion = useReducedMotion();
  const {
    contacts,
    permissionStatus,
    isLoading: contactsLoading,
    refetchContacts,
  } = useDeviceContacts();

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const data = await rechargeService.getProviders();
      const mobileProviders = data.providers.filter(
        (p: Provider) => p.service_id === 1 && p.active === 1
      );
      setProviders(mobileProviders);
    } catch (error) {
      console.error('Error loading providers:', error);
      Alert.alert('Error', 'Failed to synchronize network feeds');
    } finally {
      setLoading(false);
    }
  };

  const cleanIndianNumber = (num: string): string => {
    let baseDigits = num.replace(/\D/g, '');
    if (baseDigits.startsWith('91') && baseDigits.length > 10) {
      baseDigits = baseDigits.slice(2);
    } else if (baseDigits.startsWith('0') && baseDigits.length > 10) {
      baseDigits = baseDigits.slice(1);
    }
    return baseDigits.slice(-10);
  };

  const handleNumberInput = (text: string) => {
    const numbersOnly = text.replace(/\D/g, '');
    setMobileNumber(numbersOnly);
  };

  const filteredContacts = useMemo(() => {
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phoneNumber.includes(searchQuery)
    );
  }, [contacts, searchQuery]);

  const handleProceed = () => {
    const targetLine = cleanIndianNumber(mobileNumber);
    const isValidIndianMobile = /^[6-9]\d{9}$/.test(targetLine);

    if (!selectedOperator) {
      Alert.alert('Selection Error', 'Please choose your mobile network operator');
      return;
    }
    if (!targetLine || targetLine.length !== 10 || !isValidIndianMobile) {
      Alert.alert(
        'Input Error',
        'Please enter a valid 10-digit Indian mobile number starting with 6-9'
      );
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Input Error', 'Please enter a valid amount');
      return;
    }

    setMobileNumber(targetLine);
    setShowSummary(true);
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const clientId = `RC${Date.now()}`;
      const response = await rechargeService.recharge({
        number: mobileNumber,
        provider_id: selectedOperator?.id || 0,
        amount,
        client_id: clientId,
      });
      if (response.status_id === 1) {
        setTransactionResult(response);
        setShowSummary(false);
        setShowSuccess(true);
      } else {
        Alert.alert(
          'Transaction Declined',
          response.message || 'Please check configuration parameters.'
        );
      }
    } catch (error) {
      console.error('Recharge execution error:', error);
      Alert.alert('Link Dropped', 'Transaction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    setShowSuccess(false);
    setMobileNumber('');
    setAmount('');
    setSelectedOperator(null);
    router.back();
  };

  if (loading && providers.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-400">
          Securing Link Feeds…
        </Text>
      </View>
    );
  }

  if (showSuccess && transactionResult) {
    return (
      <SuccessScreen
        orderId={transactionResult.order_id}
        amount={transactionResult.amount}
        message={transactionResult.message}
        onDone={handleDone}
      />
    );
  }

  if (showSummary) {
    return (
      <View className="flex-1 justify-center bg-slate-50 p-4">
        <Animated.View
          entering={reducedMotion ? undefined : FadeInUp.duration(300)}
          className="mx-auto w-full max-w-md space-y-5">
          <TransactionSummary
            operatorName={selectedOperator?.provider_name || ''}
            number={mobileNumber}
            amount={amount}
          />
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => setShowSummary(false)}
              className="flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-white py-4 active:bg-slate-50">
              <Text className="text-sm font-bold text-slate-600">Modify Package</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConfirm}
              disabled={loading}
              className="flex-1"
              activeOpacity={0.9}>
              <LinearGradient
                colors={loading ? ['#94a3b8', '#64748b'] : ['#10b981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="items-center justify-center rounded-2xl py-4 shadow-md">
                <Text className="text-sm font-bold tracking-wide text-white">
                  {loading ? 'Authorizing...' : 'Authorize Settle'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      {/* SECTION 1: TRUST BANNER */}
      <Animated.View entering={reducedMotion ? undefined : FadeInDown.duration(250)}>
        <LinearGradient
          colors={['#e0e7ff', '#f3e8ff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="mb-5 rounded-3xl border border-indigo-100 p-5 shadow-sm">
          <View className="mb-3 flex-row items-center gap-2">
            <Sparkles size={18} color="#4f46e5" strokeWidth={2.5} />
            <Text className="text-sm font-black tracking-tight text-indigo-950">
              Supercharged Recharges
            </Text>
          </View>
          <View className="space-y-2.5">
            {BENEFITS.map((benefit) => (
              <View key={benefit} className="flex-row items-center gap-3">
                <CheckCircle2 size={15} color="#10b981" strokeWidth={3} />
                <Text className="flex-1 text-xs font-semibold text-indigo-900/80">{benefit}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      </Animated.View>

      {/* SECTION 2: RECENT RECHARGES SLIDER */}
      <Animated.View entering={reducedMotion ? undefined : FadeInDown.duration(250).delay(80)}>
        <View className="mb-3 flex-row items-center gap-2 px-1">
          <History size={14} color="#64748b" strokeWidth={2.5} />
          <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Recent Transactions
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10, paddingRight: 4, paddingBottom: 16 }}>
          {RECENT_RECHARGES.map((item) => (
            <TouchableOpacity
              key={item.number}
              onPress={() => {
                const verified = cleanIndianNumber(item.number);
                setMobileNumber(verified);
                toast.success(`Loaded recent target: +91 ${verified}`);
              }}
              activeOpacity={0.7}
              className="min-w-[145px] flex-row items-center gap-3 rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm active:scale-[0.98]">
              <View className="rounded-xl border border-indigo-100 bg-indigo-50 p-2">
                <Phone size={15} color="#4f46e5" strokeWidth={2.5} />
              </View>
              <View>
                <Text className="text-xs font-extrabold tracking-tight text-slate-800">
                  {item.number}
                </Text>
                <Text className="mt-0.5 text-[10px] font-bold text-slate-400">
                  {item.operator} •{' '}
                  <Text className="font-extrabold text-indigo-600">{item.amount}</Text>
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* 🌟 EMBEDDED BOUNDED CONTACTS WIDGET (Fixed Height fixes the nested scroll crash!) */}
      <View className="mt-2 overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
        {/* Internal Widget Search Bar */}

        {/* Mobile Number Entry */}
        <View className=" mt-4 flex-row items-center justify-between px-4">
          <Text className="text-xs font-bold uppercase text-slate-500">
            Quick Contacts Directory
          </Text>
          {mobileNumber ? (
            <Pressable
              onPress={() => setMobileNumber('')}
              className="rounded-lg bg-slate-100 px-2.5 py-1 active:bg-slate-200">
              <Text className="text-[10px] font-bold text-slate-600">Clear</Text>
            </Pressable>
          ) : null}
        </View>
        <View className="flex-row items-center gap-3 border-b border-slate-100 bg-slate-50/50 px-4 py-3">
          <Search size={16} color="#94a3b8" />
          <TextInput
            placeholder="Search address book..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 text-sm font-semibold text-slate-800"
          />
          <Pressable onPress={refetchContacts} className="p-1 active:opacity-50">
            <RefreshCw
              size={14}
              color="#4f46e5"
              className={contactsLoading ? 'animate-spin' : ''}
            />
          </Pressable>
        </View>

        {/* Fixed Height Box containing the FlashList */}
        <View className="h-[280px] pb-4">
          <FlashList
            data={filteredContacts}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: 12 }}
            ListEmptyComponent={
              permissionStatus === Contacts.PermissionStatus.DENIED ? (
                <View className="items-center py-8">
                  <ShieldAlert size={24} color="#f43f5e" />
                  <Text className="mt-2 text-xs font-bold text-rose-500">
                    Contacts Access Restrained
                  </Text>
                  <Text className="mt-1 max-w-[200px] text-center text-[11px] text-slate-400">
                    Authorize in device settings to sync.
                  </Text>
                </View>
              ) : contactsLoading ? (
                <View className="items-center py-8">
                  <ActivityIndicator size="small" color="#4f46e5" />
                </View>
              ) : (
                <View className="items-center py-8">
                  <Users size={24} color="#cbd5e1" />
                  <Text className="mt-2 text-xs font-bold text-slate-400">No contacts found</Text>
                </View>
              )
            }
            renderItem={({ item }) => {
              const isSelected = mobileNumber === item.phoneNumber;
              return (
                <Pressable
                  onPress={() => {
                    const targetNum = cleanIndianNumber(item.phoneNumber);
                    setMobileNumber(targetNum);
                    toast.success(`Selected: +91 ${targetNum}`);
                  }}
                  className={`mb-2 flex-row items-center rounded-xl border p-3 transition-all active:scale-[0.98] ${
                    isSelected
                      ? 'border-indigo-200 bg-indigo-50/70'
                      : 'border-slate-200/60 bg-white'
                  }`}>
                  <View className="mr-3 h-9 w-9 items-center justify-center rounded-lg border border-slate-200/40 bg-slate-100">
                    <Text className="text-[10px] font-black text-slate-600">{item.initials}</Text>
                  </View>
                  <View className="flex-1">
                    <Text
                      className="text-xs font-extrabold tracking-tight text-slate-800"
                      numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text className="text-[10px] font-semibold text-slate-400">
                      +91 {item.phoneNumber}
                    </Text>
                  </View>
                  {isSelected && (
                    <View className="ml-2 h-4 w-4 items-center justify-center rounded-full bg-indigo-600">
                      <Check size={10} color="white" strokeWidth={3} />
                    </View>
                  )}
                </Pressable>
              );
            }}
          />
        </View>
      </View>

      <View className="mt-2 border-b border-slate-100" />

      {/* SECTION 3: TRANSACTION ENTRY FIELDS */}
      <View className="space-y-4 rounded-3xl border border-slate-200/70 bg-white p-5 shadow-sm">
        {/* Operator Selection */}
        <Text className="px-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Select Network Carrier
        </Text>
        <OperatorSelector
          operators={providers}
          selectedOperator={selectedOperator}
          onSelectOperator={setSelectedOperator}
        />

        <Text className="mt-4 px-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Enter Mobile Number
        </Text>
        <View className=" mt-2 flex-row items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3.5">
          <Text className="text-sm font-extrabold text-slate-400">+91</Text>
          <TextInput
            placeholder="Type 10-digit number or select below"
            placeholderTextColor="#94a3b8"
            value={mobileNumber}
            onChangeText={handleNumberInput}
            maxLength={10}
            keyboardType="phone-pad"
            className="flex-1 text-sm font-extrabold text-slate-800"
          />
        </View>

        {/* Amount Entry */}
        <AmountInput
          value={amount}
          onChangeText={setAmount}
          quickAmounts={[10, 20, 50, 100, 200, 500, 1000]}
        />

        {/* Proceed Action Button */}
        <TouchableOpacity
          onPress={handleProceed}
          disabled={loading}
          activeOpacity={0.9}
          className="pt-2">
          <LinearGradient
            colors={loading ? ['#94a3b8', '#64748b'] : ['#4f46e5', '#3730a3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="items-center justify-center rounded-2xl py-4 shadow-md">
            <View className="flex-row items-center gap-2">
              <Zap size={16} color="white" strokeWidth={2.5} />
              <Text className="text-sm font-bold tracking-wide text-white">
                Review Order Securely
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center justify-center gap-2 py-6">
        <ShieldCheck size={14} color="#10b981" strokeWidth={2.5} />
        <Text className="text-[10px] font-bold tracking-tight text-slate-400">
          End-to-End Encrypted Settlement Channel
        </Text>
      </View>
    </ScrollView>
  );
};

export default MobileRecharge;
