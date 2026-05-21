import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
  BackHandler,
  Dimensions,
} from 'react-native';
import { Text } from '@/components/ui/text';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  useReducedMotion,
} from 'react-native-reanimated';
import { toast } from 'react-native-sonner';
import { router } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { payoutService, Beneficiary } from '@/services/payout/payout.service';
import PaymentConfirmSheet from '@/components/bbps/PaymentConfirmSheet';
import SuccessScreen from '@/components/recharge/SuccessScreen';
import {
  User,
  Building2,
  CreditCard,
  Plus,
  Phone,
  Smartphone,
  KeyRound,
  Wallet,
  Send,
  HelpCircle,
  ArrowLeft,
  ChevronLeft,
} from 'lucide-react-native';
import { ScrollView } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Tab = 'upi' | 'bank';
type UpiStep = 'mobile' | 'otp' | 'amount' | 'success';
type BankStep = 'mobile' | 'beneficiary' | 'amount' | 'success';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function TabButton({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const animatedScale = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      // Using class-based active scaling isolates the touch action safely from the re-rendering engine
      className={`flex-1 items-center justify-center rounded-xl border py-3 transition-all active:scale-[0.97] ${
        active ? 'border-white/10 bg-white shadow-sm' : 'border-transparent bg-transparent'
      }`}>
      <Text
        className={`text-sm font-extrabold tracking-tight ${active ? 'text-indigo-950' : 'text-indigo-200/70'}`}>
        {label}
      </Text>
    </Pressable>
  );
}

function BeneficiaryCard({
  b,
  onSelect,
  index,
}: {
  b: Beneficiary;
  onSelect: () => void;
  index: number;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <Animated.View
      entering={
        reducedMotion ? undefined : FadeInDown.delay(Math.min(index * 40, 300)).duration(250)
      }>
      <Pressable
        onPress={onSelect}
        className="mb-2.5 flex-row items-center rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm shadow-slate-100 transition-all active:scale-[0.99]">
        <View className="mr-3.5 h-12 w-12 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50">
          <Text className="text-base font-black text-indigo-600">
            {b.name?.charAt(0)?.toUpperCase() ?? 'B'}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-sm font-extrabold tracking-tight text-slate-800">{b.name}</Text>
          <Text className="mt-0.5 text-xs font-semibold text-slate-400">
            {b.bank_name} • ••••{b.account_number?.slice(-4)}
          </Text>
        </View>
        <View className="items-center justify-center rounded-xl bg-indigo-600 px-4 py-2">
          <Text className="text-xs font-bold text-white">Pay</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function PayoutScreen() {
  const reducedMotion = useReducedMotion();
  const [tab, setTab] = useState<Tab>('upi');

  // UPI State
  const [upiStep, setUpiStep] = useState<UpiStep>('mobile');
  const [upiMobile, setUpiMobile] = useState('');
  const [upiId, setUpiId] = useState('');
  const [upiName, setUpiName] = useState('');
  const [upiOtp, setUpiOtp] = useState('');
  const [upiAmount, setUpiAmount] = useState('');
  const [upiLoading, setUpiLoading] = useState(false);
  const [upiCustomer, setUpiCustomer] = useState<any>(null);
  const [upiConfirm, setUpiConfirm] = useState(false);
  const [upiResult, setUpiResult] = useState<any>(null);

  // Bank State
  const [bankStep, setBankStep] = useState<BankStep>('mobile');
  const [bankMobile, setBankMobile] = useState('');
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [selectedBenef, setSelectedBenef] = useState<Beneficiary | null>(null);
  const [bankAccount, setBankAccount] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAmount, setBankAmount] = useState('');
  const [bankLoading, setBankLoading] = useState(false);
  const [bankConfirm, setBankConfirm] = useState(false);
  const [bankResult, setBankResult] = useState<any>(null);
  const [showAddNew, setShowAddNew] = useState(false);

  const QUICK = useMemo(() => [500, 1000, 2000, 5000, 10000], []);

  // ── Stable Instant back action handler ──
  const handleUniversalBack = useCallback(() => {
    if (tab === 'upi') {
      if (upiStep === 'otp') {
        setUpiStep('mobile');
        return true;
      }
      if (upiStep === 'amount') {
        setUpiStep('mobile');
        return true;
      }
    } else {
      if (bankStep === 'beneficiary') {
        if (showAddNew) {
          setShowAddNew(false);
          return true;
        }
        setBankStep('mobile');
        return true;
      }
      if (bankStep === 'amount') {
        setBankStep('beneficiary');
        return true;
      }
    }
    return false;
  }, [tab, upiStep, bankStep, showAddNew]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleUniversalBack);
    return () => backHandler.remove();
  }, [handleUniversalBack]);

  // ── UPI Handlers ──
  const handleGetUpiCustomer = async () => {
    if (!upiMobile || upiMobile.length !== 10) {
      toast.error('Enter valid 10-digit mobile');
      return;
    }
    try {
      setUpiLoading(true);
      const res = await payoutService.getCustomer(upiMobile);
      if (res && (res as any).status === 'active') {
        setUpiCustomer(res);
        setUpiStep('amount');
      } else {
        setUpiStep('otp');
      }
    } catch {
      setUpiStep('otp');
    } finally {
      setUpiLoading(false);
    } // FIXED: final -> finally
  };

  const handleAddUpiCustomer = async () => {
    if (!upiId || !upiName) {
      toast.error('Fill all fields');
      return;
    }
    try {
      setUpiLoading(true);
      await payoutService.addCustomer({ mobile_number: upiMobile, upi_id: upiId, name: upiName });
      toast.success('Verification code dispatched via SMS');
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Failed to add node record');
    } finally {
      setUpiLoading(false);
    } // FIXED: final -> finally
  };

  const handleConfirmUpiCustomer = async () => {
    if (!upiOtp) {
      toast.error('Enter OTP');
      return;
    }
    try {
      setUpiLoading(true);
      await payoutService.confirmCustomer({ mobile_number: upiMobile, otp: upiOtp });
      setUpiStep('amount');
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'OTP authentication dropped');
    } finally {
      setUpiLoading(false);
    } // FIXED: final -> finally
  };

  const handleUpiTransfer = async () => {
    try {
      setUpiLoading(true);
      const res = await payoutService.upiTransfer({
        mobile_number: upiMobile,
        upi_id: upiId || upiCustomer?.upi_id,
        amount: upiAmount,
        client_id: `UPI${Date.now()}`,
      });
      if (res?.status_id === 1) {
        setUpiResult(res);
        setUpiConfirm(false);
        setUpiStep('success');
      } else {
        toast.error(res?.message ?? 'Transfer rolled back');
        setUpiConfirm(false);
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Processing link failed');
      setUpiConfirm(false);
    } finally {
      setUpiLoading(false);
    } // FIXED: final -> finally
  };

  // ── Bank Handlers ──
  const handleLoadBeneficiaries = async () => {
    if (!bankMobile || bankMobile.length !== 10) {
      toast.error('Enter valid 10-digit mobile number');
      return;
    }
    try {
      setBankLoading(true);
      const res = await payoutService.getBeneficiaries(bankMobile);
      const list: Beneficiary[] = Array.isArray(res) ? res : ((res as any)?.data ?? []);
      setBeneficiaries(list);
      setBankStep('beneficiary');
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Account balance check dropped list download');
    } finally {
      setBankLoading(false);
    } // FIXED: final -> finally
  };

  const handleBankTransfer = async () => {
    try {
      setBankLoading(true);
      const res = await payoutService.bankTransfer({
        mobile_number: bankMobile,
        account_number: selectedBenef?.account_number ?? bankAccount,
        ifsc: selectedBenef?.ifsc ?? bankIfsc,
        name: selectedBenef?.name ?? bankName,
        amount: bankAmount,
        client_id: `BNK${Date.now()}`,
      });
      if (res?.status_id === 1) {
        setBankResult(res);
        setBankConfirm(false);
        setBankStep('success');
      } else {
        toast.error(res?.message ?? 'Clearing house network timeout');
        setBankConfirm(false);
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Bank pipeline execution error');
      setBankConfirm(false);
    } finally {
      setBankLoading(false);
    } // FIXED: final -> finally
  };

  const handleUpiDone = () => {
    setUpiStep('mobile');
    setUpiMobile('');
    setUpiId('');
    setUpiName('');
    setUpiOtp('');
    setUpiAmount('');
    setUpiCustomer(null);
    setUpiResult(null);
  };

  const handleBankDone = () => {
    setBankStep('mobile');
    setBankMobile('');
    setBeneficiaries([]);
    setSelectedBenef(null);
    setBankAccount('');
    setBankIfsc('');
    setBankName('');
    setBankAmount('');
    setBankResult(null);
    setShowAddNew(false);
  };

  if (tab === 'upi' && upiStep === 'success' && upiResult) {
    return (
      <SuccessScreen
        orderId={upiResult.order_id}
        amount={upiResult.amount}
        message="UPI Clearing Settled!"
        onDone={handleUpiDone}
      />
    );
  }
  if (tab === 'bank' && bankStep === 'success' && bankResult) {
    return (
      <SuccessScreen
        orderId={bankResult.order_id}
        amount={bankResult.amount}
        message="National Settlement Dispatched!"
        onDone={handleBankDone}
      />
    );
  }

  return (
    <View className="flex-1 bg-[#f8fafc]">
      {/* 🌟 Premium High-Contrast Metallic Gradient Header Header */}
      <LinearGradient
        colors={['#1e1b4b', '#2e2a72', '#4338ca']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-b-[32px] px-5 pb-6 pt-12 shadow-lg shadow-indigo-950/20">
        <View className="flex-row items-center gap-4">
          <Pressable
            onPress={() => {
              if (!handleUniversalBack()) router.back();
            }}
            className="h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 active:bg-white/20">
            <ChevronLeft size={22} color="white" strokeWidth={2.5} />
          </Pressable>
          <View>
            <Text className="text-xl font-black tracking-tight text-white">Payout Engine</Text>
            <Text className="mt-0.5 text-xs font-semibold text-indigo-200/80">
              Instant asset routing via national clearance bridges
            </Text>
          </View>
        </View>

        {/* Floating Toggle Controls */}
        <View className="mt-6 flex-row gap-2 rounded-2xl border border-indigo-500/10 bg-indigo-950/40 p-1.5">
          <TabButton
            active={tab === 'upi'}
            label="UPI Instant"
            onPress={() => {
              setTab('upi');
            }}
          />
          <TabButton
            active={tab === 'bank'}
            label="Bank IMPS/NEFT"
            onPress={() => {
              setTab('bank');
            }}
          />
        </View>
      </LinearGradient>

      <View className="flex-1 px-4 pt-5">
        {/* ── UPI TIMELINE FLOW ── */}
        {tab === 'upi' && (
          <Animated.View
            className="flex-1"
            entering={reducedMotion ? undefined : FadeIn.duration(200)}>
            {upiStep === 'mobile' && (
              <Animated.View
                entering={reducedMotion ? undefined : FadeInDown.duration(300)}
                className="space-y-4">
                <View className="px-1">
                  <Text className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Recipient Identifier
                  </Text>
                </View>
                <View className="flex-row items-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm focus:border-indigo-500">
                  <View className="border-r border-slate-200 bg-slate-50 px-4 py-4">
                    <Text className="text-sm font-extrabold text-slate-700">+91</Text>
                  </View>
                  <TextInput
                    placeholder="Enter 10-digit smartphone index"
                    placeholderTextColor="#94a3b8"
                    value={upiMobile}
                    onChangeText={setUpiMobile}
                    keyboardType="numeric"
                    maxLength={10}
                    className="flex-1 px-4 py-4 text-sm font-semibold text-slate-800"
                  />
                </View>
                <Pressable onPress={handleGetUpiCustomer} disabled={upiLoading} className="mt-2">
                  <LinearGradient
                    colors={['#4f46e5', '#3730a3']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="items-center justify-center rounded-2xl py-4 shadow-md shadow-indigo-600/10">
                    {upiLoading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="text-sm font-bold tracking-wide text-white">
                        Secure Authentication
                      </Text>
                    )}
                  </LinearGradient>
                </Pressable>
              </Animated.View>
            )}

            {upiStep === 'otp' && (
              <Animated.View
                entering={reducedMotion ? undefined : FadeInDown.duration(300)}
                className="space-y-4">
                <View className="px-1">
                  <Text className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Dynamic Node Provisioning
                  </Text>
                </View>
                <View>
                  <Text className="mb-1.5 px-1 text-xs font-bold uppercase text-slate-500">
                    Virtual Payment Address (VPA)
                  </Text>
                  <TextInput
                    placeholder="username@bankhandle"
                    placeholderTextColor="#94a3b8"
                    value={upiId}
                    onChangeText={setUpiId}
                    autoCapitalize="none"
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-800 shadow-sm"
                  />
                </View>
                <View>
                  <Text className="mb-1.5 px-1 text-xs font-bold uppercase text-slate-500">
                    Legal Holder Name
                  </Text>
                  <TextInput
                    placeholder="As registered in passbook"
                    placeholderTextColor="#94a3b8"
                    value={upiName}
                    onChangeText={setUpiName}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-800 shadow-sm"
                  />
                </View>
                <Pressable onPress={handleAddUpiCustomer} disabled={upiLoading}>
                  <LinearGradient
                    colors={['#4f46e5', '#3730a3']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="items-center rounded-2xl py-4">
                    {upiLoading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="text-sm font-bold text-white">Generate Hardware OTP</Text>
                    )}
                  </LinearGradient>
                </Pressable>
                <View className="mt-4 border-t border-slate-200/60 pt-2">
                  <Text className="mb-1.5 px-1 text-xs font-bold uppercase text-slate-500">
                    SMS Challenge Code
                  </Text>
                  <TextInput
                    placeholder="Enter 6-digit numeric core OTP"
                    placeholderTextColor="#94a3b8"
                    value={upiOtp}
                    onChangeText={setUpiOtp}
                    keyboardType="numeric"
                    maxLength={6}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center text-sm font-semibold tracking-[6px] text-slate-800 shadow-sm"
                  />
                </View>
                <Pressable onPress={handleConfirmUpiCustomer} disabled={upiLoading}>
                  <LinearGradient
                    colors={['#10b981', '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="items-center rounded-2xl py-4 shadow-md shadow-emerald-600/10">
                    {upiLoading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="text-sm font-bold text-white">Verify Challenge & Bind</Text>
                    )}
                  </LinearGradient>
                </Pressable>
              </Animated.View>
            )}

            {upiStep === 'amount' && (
              <Animated.View
                entering={reducedMotion ? undefined : FadeInDown.duration(300)}
                className="space-y-4">
                {upiCustomer && (
                  <View className="flex-row items-center gap-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm shadow-slate-100">
                    <View className="h-12 w-12 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50">
                      <User size={20} color="#059669" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-extrabold tracking-tight text-slate-800">
                        {upiCustomer?.name ?? 'Verified Account'}
                      </Text>
                      <Text className="mt-0.5 text-xs font-semibold text-slate-400">
                        {upiCustomer?.upi_id ?? upiId}
                      </Text>
                    </View>
                  </View>
                )}

                <View className="px-1">
                  <Text className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Settlement Ledger Allocation
                  </Text>
                </View>
                <View className="flex-row items-center rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm focus-within:border-indigo-500">
                  <Text className="mr-2 text-xl font-black text-slate-400">₹</Text>
                  <TextInput
                    placeholder="0.00"
                    placeholderTextColor="#cbd5e1"
                    value={upiAmount}
                    onChangeText={setUpiAmount}
                    keyboardType="numeric"
                    className="flex-1 text-base font-extrabold text-slate-800"
                  />
                </View>

                <View className="flex-row flex-wrap gap-2">
                  {QUICK.map((a) => {
                    const isSel = upiAmount === String(a);
                    return (
                      <Pressable
                        key={a}
                        onPress={() => setUpiAmount(String(a))}
                        className={`rounded-2xl border px-5 py-2.5 transition-all ${isSel ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 bg-white'}`}>
                        <Text
                          className={`text-xs font-bold ${isSel ? 'text-indigo-700' : 'text-slate-600'}`}>
                          ₹{a.toLocaleString('en-IN')}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <View className="p-4.5 flex-row items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60">
                  <Wallet size={16} color="#059669" />
                  <Text className="flex-1 text-xs font-semibold text-emerald-800">
                    Secured clearance routing enabled from authorized Pay2All core balance
                    registers.
                  </Text>
                </View>

                <Pressable
                  onPress={() => {
                    if (!upiAmount || parseFloat(upiAmount) <= 0) {
                      toast.error('Enter valid amount');
                      return;
                    }
                    setUpiConfirm(true);
                  }}
                  className="pt-2">
                  <LinearGradient
                    colors={['#10b981', '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="flex-row items-center justify-center gap-2 rounded-2xl py-4 shadow-lg shadow-emerald-600/20">
                    <Send size={16} color="white" strokeWidth={2.5} />
                    <Text className="text-sm font-bold tracking-wide text-white">
                      Dispatch Assets Immediately
                    </Text>
                  </LinearGradient>
                </Pressable>
              </Animated.View>
            )}
          </Animated.View>
        )}

        {/* ── BANK SELECTION FLOW (Shopify FlashList Integrated) ── */}
        {tab === 'bank' && (
          <Animated.View
            className="flex-1"
            entering={reducedMotion ? undefined : FadeIn.duration(200)}>
            {bankStep === 'mobile' && (
              <Animated.View
                entering={reducedMotion ? undefined : FadeInDown.duration(300)}
                className="space-y-4">
                <View className="px-1">
                  <Text className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Sender Registration Index
                  </Text>
                </View>
                <View className="flex-row items-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <View className="border-r border-slate-200 bg-slate-50 px-4 py-4">
                    <Text className="text-sm font-extrabold text-slate-700">+91</Text>
                  </View>
                  <TextInput
                    placeholder="10-digit mobile line"
                    placeholderTextColor="#94a3b8"
                    value={bankMobile}
                    onChangeText={setBankMobile}
                    keyboardType="numeric"
                    maxLength={10}
                    className="flex-1 px-4 py-4 text-sm font-semibold text-slate-800"
                  />
                </View>
                <Pressable
                  onPress={handleLoadBeneficiaries}
                  disabled={bankLoading}
                  className="mt-2">
                  <LinearGradient
                    colors={['#4f46e5', '#3730a3']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="items-center rounded-2xl py-4 shadow-md shadow-indigo-600/10">
                    {bankLoading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="text-sm font-bold text-white">
                        Synchronize Node Directories
                      </Text>
                    )}
                  </LinearGradient>
                </Pressable>
              </Animated.View>
            )}

            {bankStep === 'beneficiary' && !showAddNew && (
              <View className="min-h-[300px] flex-1">
                <View className="mb-4 flex-row items-center justify-between px-1">
                  <Text className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Verified Beneficiary Directives
                  </Text>
                  <Pressable
                    onPress={() => setShowAddNew(true)}
                    className="flex-row items-center gap-1.5 rounded-xl border border-indigo-100 bg-indigo-50 px-3.5 py-2 active:opacity-80">
                    <Plus size={14} color="#4f46e5" strokeWidth={3} />
                    <Text className="text-xs font-extrabold text-indigo-600">Register Node</Text>
                  </Pressable>
                </View>

                <FlashList
                  data={beneficiaries}
                  keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 40 }}
                  ListEmptyComponent={
                    <View className="mt-6 items-center rounded-3xl border border-slate-100 bg-white p-8 shadow-sm shadow-slate-100/50">
                      <Building2 size={40} color="#cbd5e1" />
                      <Text className="mt-3 text-base font-bold text-slate-700">
                        Clearance Map Blank
                      </Text>
                      <Text className="mt-1 max-w-[200px] text-center text-xs font-medium text-slate-400">
                        No active clearing-house entities found attached to this subscriber
                        terminal.
                      </Text>
                      <Pressable onPress={() => setShowAddNew(true)} className="mt-5 w-full">
                        <LinearGradient
                          colors={['#4f46e5', '#3730a3']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          className="items-center rounded-2xl py-3.5">
                          <Text className="text-xs font-bold tracking-wide text-white">
                            Provision First Account
                          </Text>
                        </LinearGradient>
                      </Pressable>
                    </View>
                  }
                  renderItem={({ item, index }) => (
                    <BeneficiaryCard
                      b={item}
                      index={index}
                      onSelect={() => {
                        setSelectedBenef(item);
                        setBankStep('amount');
                      }}
                    />
                  )}
                />
              </View>
            )}

            {bankStep === 'beneficiary' && showAddNew && (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
                className="space-y-4">
                <View className="px-1">
                  <Text className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Registering Clearing Target
                  </Text>
                </View>

                {[
                  {
                    label: 'Account Number',
                    value: bankAccount,
                    set: setBankAccount,
                    key: 'numeric',
                    max: 20,
                    icon: <CreditCard size={16} color="#94a3b8" />,
                  },
                  {
                    label: 'IFSC Code',
                    value: bankIfsc,
                    set: setBankIfsc,
                    key: 'default',
                    max: 11,
                    icon: <Building2 size={16} color="#94a3b8" />,
                  },
                  {
                    label: 'Account Holder Legal Name',
                    value: bankName,
                    set: setBankName,
                    key: 'default',
                    max: 50,
                    icon: <User size={16} color="#94a3b8" />,
                  },
                ].map((f) => (
                  <View key={f.label} className="mb-1">
                    <Text className="mb-1.5 px-1 text-xs font-bold uppercase text-slate-500">
                      {f.label}
                    </Text>
                    <View className="flex-row items-center rounded-2xl border border-slate-200 bg-white px-4 shadow-sm focus-within:border-indigo-500">
                      <View className="mr-3">{f.icon}</View>
                      <TextInput
                        placeholder={`Input details`}
                        placeholderTextColor="#94a3b8"
                        value={f.value}
                        onChangeText={f.set}
                        keyboardType={f.key as any}
                        maxLength={f.max}
                        autoCapitalize={f.label.includes('IFSC') ? 'characters' : 'none'}
                        className="flex-1 py-4 text-sm font-semibold text-slate-800"
                      />
                    </View>
                  </View>
                ))}

                <View className="flex-row gap-3 pt-3">
                  <Pressable
                    onPress={() => setShowAddNew(false)}
                    className="flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-white py-4 active:bg-slate-50">
                    <Text className="text-sm font-bold text-slate-600">Cancel</Text>
                  </Pressable>
                  <Pressable
                    className="flex-1"
                    onPress={() => {
                      if (!bankAccount || !bankIfsc || !bankName) {
                        toast.error('Fill all fields');
                        return;
                      }
                      setSelectedBenef({
                        id: Date.now(),
                        name: bankName,
                        account_number: bankAccount,
                        ifsc: bankIfsc,
                        bank_name: 'Verified Clearing Member',
                        mobile_number: bankMobile,
                      });
                      setBankStep('amount');
                      setShowAddNew(false);
                    }}>
                    <LinearGradient
                      colors={['#4f46e5', '#3730a3']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      className="items-center rounded-2xl py-4 shadow-md shadow-indigo-600/10">
                      <Text className="text-sm font-bold text-white">Save & Proceed</Text>
                    </LinearGradient>
                  </Pressable>
                </View>
              </ScrollView>
            )}

            {bankStep === 'amount' && selectedBenef && (
              <Animated.View
                entering={reducedMotion ? undefined : FadeInDown.duration(300)}
                className="space-y-4">
                <View className="flex-row items-center gap-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
                  <View className="h-12 w-12 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50">
                    <Building2 size={20} color="#4f46e5" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-extrabold tracking-tight text-slate-800">
                      {selectedBenef.name}
                    </Text>
                    <Text className="mt-0.5 text-xs font-semibold text-slate-400">
                      {selectedBenef.bank_name} • ••••{selectedBenef.account_number?.slice(-4)}
                    </Text>
                  </View>
                </View>

                <View className="px-1">
                  <Text className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Settlement Allocation
                  </Text>
                </View>
                <View className="flex-row items-center rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                  <Text className="mr-2 text-xl font-black text-slate-400">₹</Text>
                  <TextInput
                    placeholder="0.00"
                    placeholderTextColor="#cbd5e1"
                    value={bankAmount}
                    onChangeText={setBankAmount}
                    keyboardType="numeric"
                    className="flex-1 text-base font-extrabold text-slate-800"
                  />
                </View>

                <View className="flex-row flex-wrap gap-2">
                  {QUICK.map((a) => {
                    const isSel = bankAmount === String(a);
                    return (
                      <Pressable
                        key={a}
                        onPress={() => setBankAmount(String(a))}
                        className={`rounded-2xl border px-5 py-2.5 transition-all ${isSel ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 bg-white'}`}>
                        <Text
                          className={`text-xs font-bold ${isSel ? 'text-indigo-700' : 'text-slate-600'}`}>
                          ₹{a.toLocaleString('en-IN')}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <View className="flex-row gap-3 pt-4">
                  <Pressable
                    onPress={() => setBankStep('beneficiary')}
                    className="h-[54px] w-[54px] items-center justify-center rounded-2xl border border-slate-200 bg-white active:bg-slate-50">
                    <ChevronLeft size={22} color="#475569" strokeWidth={2.5} />
                  </Pressable>
                  <Pressable
                    className="flex-1"
                    onPress={() => {
                      if (!bankAmount || parseFloat(bankAmount) <= 0) {
                        toast.error('Enter valid amount');
                        return;
                      }
                      setBankConfirm(true);
                    }}>
                    <LinearGradient
                      colors={['#10b981', '#059669']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      className="h-[54px] flex-row items-center justify-center gap-2 rounded-2xl shadow-lg shadow-emerald-600/20">
                      <CreditCard size={16} color="white" strokeWidth={2.5} />
                      <Text className="text-sm font-bold tracking-wide text-white">
                        Execute Interbank Settlement
                      </Text>
                    </LinearGradient>
                  </Pressable>
                </View>
              </Animated.View>
            )}
          </Animated.View>
        )}
      </View>

      {/* Confirm Sheets */}
      <PaymentConfirmSheet
        visible={upiConfirm}
        billerName={upiCustomer?.name ?? upiId}
        consumerNumber={upiId}
        amount={upiAmount}
        onConfirm={handleUpiTransfer}
        onCancel={() => setUpiConfirm(false)}
        isLoading={upiLoading}
      />
      <PaymentConfirmSheet
        visible={bankConfirm}
        billerName={selectedBenef?.name ?? ''}
        consumerNumber={selectedBenef?.account_number ?? ''}
        amount={bankAmount}
        onConfirm={handleBankTransfer}
        onCancel={() => setBankConfirm(false)}
        isLoading={bankLoading}
      />
    </View>
  );
}
