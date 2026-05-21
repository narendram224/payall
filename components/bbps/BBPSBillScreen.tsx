import React, { useMemo } from 'react';
import {
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  BackHandler,
  Dimensions,
} from 'react-native';
import { Text } from '@/components/ui/text';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Search,
  ChevronLeft,
  AlertCircle,
  HelpCircle,
  Landmark,
  CreditCard,
  ShieldCheck,
} from 'lucide-react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';
import { toast } from 'react-native-sonner';
import BillerCard from '@/components/bbps/BillerCard';
import BillFetchResult from '@/components/bbps/BillFetchResult';
import PaymentConfirmSheet from '@/components/bbps/PaymentConfirmSheet';
import SuccessScreen from '@/components/recharge/SuccessScreen';
import apiClient from '@/api/client';
import { ScrollView } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Step = 'selectBiller' | 'enterConsumer' | 'viewBill' | 'success';

interface BillerInputParam {
  paramName: string;
  dataType: string;
  optional: boolean;
  minLength?: number;
  maxLength?: number;
}

interface Biller {
  billerID: string;
  billerName: string;
  billerAlias?: string;
  icon?: string;
  billerInputParams?: BillerInputParam[];
  billerAcceptsAdhoc?: boolean;
}

interface BBPSFormState {
  step: Step;
  selectedBiller: Biller | null;
  consumerParams: Record<string, string>;
  amount: string;
  billData: any | null;
  searchQuery: string;
  confirmVisible: boolean;
  transactionResult: any | null;
}

interface BBPSBillScreenProps {
  categorySlug: string;
  serviceTitle: string;
  consumerLabel?: string;
  consumerPlaceholder?: string;
  consumerKeyboardType?: 'numeric' | 'default';
  consumerMaxLength?: number;
  quickAmounts?: number[];
}

const BBPSBillScreen: React.FC<BBPSBillScreenProps> = ({
  categorySlug,
  serviceTitle,
  consumerLabel = 'Consumer Number',
  consumerPlaceholder = 'Enter consumer number',
  consumerKeyboardType = 'numeric',
  consumerMaxLength = 20,
  quickAmounts = [200, 500, 1000, 2000, 5000],
}) => {
  const queryClient = useQueryClient();
  const reducedMotion = useReducedMotion();
  const cacheKey = useMemo(() => ['bbps_form_state', categorySlug], [categorySlug]);

  const defaultState: BBPSFormState = useMemo(
    () => ({
      step: 'selectBiller',
      selectedBiller: null,
      consumerParams: {},
      amount: '',
      billData: null,
      searchQuery: '',
      confirmVisible: false,
      transactionResult: null,
    }),
    []
  );

  // 1. FIXED: Added dummy queryFn to fix the "No queryFn was passed" TanStack error
  const { data: formState = defaultState } = useQuery<BBPSFormState>({
    queryKey: cacheKey,
    queryFn: () => defaultState,
    initialData: defaultState,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const updateCache = (updates: Partial<BBPSFormState>) => {
    queryClient.setQueryData(cacheKey, (old: BBPSFormState | undefined) => ({
      ...(old ?? defaultState),
      ...updates,
    }));
  };

  const {
    data: billers = [],
    isLoading: billerLoading,
    error: billerError,
    refetch: fetchBillers,
  } = useQuery<Biller[]>({
    queryKey: ['bbps_billers', categorySlug],
    queryFn: async () => {
      const res: any = await apiClient.get(`bbps/category/${categorySlug}`);
      const list = res?.data ?? res?.billers ?? res ?? [];
      return Array.isArray(list) ? list : [];
    },
    staleTime: 1000 * 60 * 15,
  });

  // 2. FIXED: Stable, instantaneous back handler navigation logic
  const handleBackNavigation = React.useCallback(() => {
    const currentState = queryClient.getQueryData<BBPSFormState>(cacheKey) ?? defaultState;

    if (currentState.step === 'enterConsumer') {
      queryClient.setQueryData(cacheKey, {
        ...currentState,
        step: 'selectBiller',
        selectedBiller: null,
        consumerParams: {},
      });
      return true;
    } else if (currentState.step === 'viewBill') {
      queryClient.setQueryData(cacheKey, {
        ...currentState,
        step: 'enterConsumer',
        billData: null,
      });
      return true;
    }
    return false;
  }, [queryClient, cacheKey, defaultState]);

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackNavigation);
    return () => backHandler.remove();
  }, [handleBackNavigation]);

  const fetchBillMutation = useMutation({
    mutationFn: async (params: Record<string, string>) => {
      const clientId = `BP${Date.now()}`;
      const fd = new FormData();
      fd.append('billerID', formState.selectedBiller!.billerID);
      fd.append('clientId', clientId);
      Object.entries(params).forEach(([k, v]) => {
        fd.append(`customerParams[${k}]`, v);
      });
      return await apiClient.post('bbps/fetch', fd);
    },
    onSuccess: (res: any) => {
      if (res?.status_id === 1) {
        const fetchedBill = res?.data ?? res;
        updateCache({
          billData: fetchedBill,
          amount: fetchedBill?.billAmount ? String(fetchedBill.billAmount) : formState.amount,
          step: 'viewBill',
        });
      } else {
        toast.error(res?.message ?? 'Failed to parse billing details.');
        if (formState.selectedBiller?.billerAcceptsAdhoc) {
          updateCache({ step: 'viewBill' });
        }
      }
    },
    onError: () => {
      toast.error('Could not verify bill data.');
      if (formState.selectedBiller?.billerAcceptsAdhoc) {
        updateCache({ step: 'viewBill' });
      }
    },
  });

  const payBillMutation = useMutation({
    mutationFn: async () => {
      const clientId = `BP${Date.now()}`;
      const fd = new FormData();
      fd.append('billerID', formState.selectedBiller!.billerID);
      fd.append('amount', formState.amount);
      fd.append('clientId', clientId);
      fd.append('paymentMode', 'Internet Banking');
      Object.entries(formState.consumerParams).forEach(([k, v]) => {
        fd.append(`customerParams[${k}]`, v);
      });
      return await apiClient.post('bbps/payment', fd);
    },
    onSuccess: (res: any) => {
      if (res?.status_id === 1) {
        updateCache({ transactionResult: res, confirmVisible: false, step: 'success' });
      } else {
        toast.error(res?.message ?? 'Payment process declined.');
        updateCache({ confirmVisible: false });
      }
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message ?? 'Transaction dropped.');
      updateCache({ confirmVisible: false });
    },
  });

  const handleSelectBiller = (biller: Biller) => {
    const params: Record<string, string> = {};
    biller.billerInputParams?.forEach((p) => {
      params[p.paramName] = '';
    });
    updateCache({ selectedBiller: biller, consumerParams: params, step: 'enterConsumer' });
  };

  const handleFetchBillSubmit = () => {
    const primaryParam = Object.keys(formState.consumerParams)[0];
    const primaryValue = primaryParam ? formState.consumerParams[primaryParam] : '';
    if (!primaryValue || primaryValue.length < 2) {
      toast.error(`Please provide a valid ${consumerLabel}`);
      return;
    }
    fetchBillMutation.mutate(formState.consumerParams);
  };

  const handleDone = () => {
    queryClient.setQueryData(cacheKey, defaultState);
    router.back();
  };

  if (formState.step === 'success' && formState.transactionResult) {
    return (
      <SuccessScreen
        orderId={formState.transactionResult.order_id}
        amount={formState.transactionResult.amount}
        message={`${serviceTitle} bill settled successfully.`}
        onDone={handleDone}
      />
    );
  }

  const filteredBillers = billers.filter((b) =>
    b.billerName.toLowerCase().includes(formState.searchQuery.toLowerCase())
  );

  const primaryParamKey =
    formState.selectedBiller?.billerInputParams?.[0]?.paramName ?? 'consumer_number';
  const primaryValue = formState.consumerParams[primaryParamKey] ?? '';

  console.log('filteredBillers[Data]', filteredBillers);

  return (
    <View className="flex-1 bg-[#f8fafc]">
      {/* Premium Linear Gradient Header */}
      <LinearGradient
        colors={['#1e1b4b', '#312e81', '#4338ca']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-b-[32px] px-5 pb-6 pt-12 shadow-lg shadow-indigo-900/30">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-4">
            <Pressable
              onPress={() => {
                if (!handleBackNavigation()) router.back();
              }}
              className="h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 active:bg-white/20">
              <ChevronLeft size={22} color="white" strokeWidth={2.5} />
            </Pressable>
            <View>
              <Text className="text-xl font-extrabold tracking-tight text-white">
                {serviceTitle}
              </Text>
              <Text className="mt-0.5 text-xs font-medium text-indigo-200/80">
                {formState.step === 'selectBiller'
                  ? 'Select Verified BBPS Provider'
                  : formState.step === 'enterConsumer'
                    ? 'Account Verification details'
                    : 'Secure Gate Checkout'}
              </Text>
            </View>
          </View>
          <View className="h-9 w-9 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
            <ShieldCheck size={20} color="#10b981" />
          </View>
        </View>

        {/* Dynamic Progress Indicator */}
        <View className="mt-6 flex-row gap-2.5 px-1">
          {['Provider', 'Details', 'Settle'].map((label, i) => {
            const currentIdx =
              formState.step === 'selectBiller' ? 0 : formState.step === 'enterConsumer' ? 1 : 2;
            const active = i <= currentIdx;
            const isCurrent = i === currentIdx;
            return (
              <View
                key={label}
                className={`flex-1 rounded-2xl border py-2 ${
                  isCurrent
                    ? 'border-white bg-white'
                    : active
                      ? 'border-indigo-400/20 bg-indigo-500/30'
                      : 'border-white/5 bg-white/5'
                }`}>
                <Text
                  className={`text-center text-xs font-bold tracking-wide ${
                    isCurrent ? 'text-indigo-950' : active ? 'text-indigo-100' : 'text-white/40'
                  }`}>
                  {label}
                </Text>
              </View>
            );
          })}
        </View>
      </LinearGradient>

      {/* ===== STEP 1: SELECT BILLER (Optimized via Shopify FlashList) ===== */}
      {formState.step === 'selectBiller' && (
        <View className="flex-1 px-4 pt-4">
          <View className="mb-4 rounded-2xl border border-slate-200/60 bg-white p-3 shadow-sm shadow-slate-100">
            <View className="flex-row items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-3">
              <Search size={18} color="#94a3b8" strokeWidth={2.2} />
              <TextInput
                placeholder="Search institutional provider..."
                placeholderTextColor="#94a3b8"
                value={formState.searchQuery}
                onChangeText={(t) => updateCache({ searchQuery: t })}
                className="flex-1 text-sm font-medium text-slate-800"
              />
            </View>
          </View>

          {billerLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#4f46e5" />
              <Text className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                Securing Provider Stream…
              </Text>
            </View>
          ) : billerError ? (
            <Animated.View
              entering={reducedMotion ? undefined : FadeIn.duration(300)}
              className="flex-1 items-center justify-center px-8">
              <View className="rounded-full border border-red-100 bg-red-50 p-4">
                <AlertCircle size={40} color="#ef4444" />
              </View>
              <Text className="mt-4 text-center text-base font-bold text-slate-800">
                Network Stream Inaccessible
              </Text>
              <Pressable
                onPress={() => fetchBillers()}
                className="mt-6 rounded-2xl bg-indigo-600 px-8 py-3.5 shadow-md">
                <Text className="text-sm font-bold text-white">Synchronize Feed</Text>
              </Pressable>
            </Animated.View>
          ) : (
            <View className="min-h-[200px] flex-1" style={{ width: SCREEN_WIDTH - 32 }}>
              <FlashList
                data={filteredBillers}
                keyExtractor={(item) => item.billerID}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 32 }}
                refreshControl={
                  <RefreshControl
                    refreshing={billerLoading}
                    onRefresh={fetchBillers}
                    colors={['#4f46e5']}
                  />
                }
                ListEmptyComponent={
                  <View className="mt-16 items-center rounded-3xl border border-slate-100 bg-white p-8">
                    <HelpCircle size={36} color="#cbd5e1" />
                    <Text className="mt-2 text-sm font-bold text-slate-400">
                      No matching networks located
                    </Text>
                  </View>
                }
                renderItem={({ item, index }) => (
                  <View className="mb-2.5">
                    <BillerCard
                      billerID={item.billerID}
                      billerName={item.billerName}
                      icon={item.icon}
                      index={index}
                      onPress={() => handleSelectBiller(item)}
                    />
                  </View>
                )}
              />
            </View>
          )}
        </View>
      )}

      {/* ===== STEP 2: ENTER CONSUMER DETAILS ===== */}
      {formState.step === 'enterConsumer' && formState.selectedBiller && (
        <ScrollView
          className="flex-1 px-4 pt-5"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}>
          <Animated.View
            entering={reducedMotion ? undefined : FadeInDown.duration(300)}
            className="mb-5 flex-row items-center gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <View className="h-12 w-12 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50">
              <Landmark size={22} color="#4338ca" />
            </View>
            <View className="flex-1">
              <Text className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">
                Selected Provider
              </Text>
              <Text className="mt-0.5 text-base font-extrabold text-slate-800">
                {formState.selectedBiller.billerName}
              </Text>
            </View>
          </Animated.View>

          {formState.selectedBiller.billerInputParams?.map((param, idx) => (
            <Animated.View
              key={param.paramName}
              entering={reducedMotion ? undefined : FadeInDown.delay(idx * 50).duration(300)}
              className="mb-4">
              <Text className="mb-1.5 px-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                {param.paramName.replace(/_/g, ' ')}
                {!param.optional && <Text className="text-rose-500"> *</Text>}
              </Text>
              <TextInput
                placeholder={`Enter ${param.paramName.replace(/_/g, ' ').toLowerCase()}`}
                placeholderTextColor="#94a3b8"
                value={formState.consumerParams[param.paramName] ?? ''}
                onChangeText={(t) =>
                  updateCache({
                    consumerParams: { ...formState.consumerParams, [param.paramName]: t },
                  })
                }
                keyboardType={param.dataType === 'NUMERIC' ? 'numeric' : 'default'}
                maxLength={param.maxLength}
                autoCapitalize="none"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-800 shadow-sm"
              />
            </Animated.View>
          )) ?? (
            <Animated.View
              entering={reducedMotion ? undefined : FadeInDown.delay(100).duration(300)}
              className="mb-4">
              <Text className="mb-1.5 px-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                {consumerLabel} <Text className="text-rose-500">*</Text>
              </Text>
              <TextInput
                placeholder={consumerPlaceholder}
                placeholderTextColor="#94a3b8"
                value={primaryValue}
                onChangeText={(t) =>
                  updateCache({
                    consumerParams: { ...formState.consumerParams, [primaryParamKey]: t },
                  })
                }
                keyboardType={consumerKeyboardType}
                maxLength={consumerMaxLength}
                autoCapitalize="none"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-800 shadow-sm"
              />
            </Animated.View>
          )}

          <Animated.View
            entering={reducedMotion ? undefined : FadeInDown.delay(150).duration(300)}
            className="mt-4">
            <Pressable onPress={handleFetchBillSubmit} disabled={fetchBillMutation.isPending}>
              <LinearGradient
                colors={['#4f46e5', '#3730a3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="items-center justify-center rounded-2xl py-4 shadow-lg">
                {fetchBillMutation.isPending ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-sm font-bold text-white">Validate & Fetch Statement</Text>
                )}
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </ScrollView>
      )}

      {/* ===== STEP 3: VIEW BILL + PAY ===== */}
      {formState.step === 'viewBill' && (
        <ScrollView
          className="flex-1 px-4 pt-5"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}>
          {formState.billData && (
            <Animated.View
              entering={reducedMotion ? undefined : FadeInDown.duration(300)}
              className="mb-5">
              <BillFetchResult
                billerName={formState.selectedBiller?.billerName ?? ''}
                consumerNumber={primaryValue}
                bill={formState.billData}
              />
            </Animated.View>
          )}

          <Animated.View
            entering={reducedMotion ? undefined : FadeInDown.delay(80).duration(300)}
            className="mb-4">
            <Text className="mb-1.5 px-1 text-xs font-bold uppercase tracking-wide text-slate-500">
              Settlement Amount <Text className="text-rose-500">*</Text>
            </Text>
            <View className="flex-row items-center rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
              <Text className="mr-2 text-xl font-black text-slate-400">₹</Text>
              <TextInput
                placeholder="0.00"
                placeholderTextColor="#cbd5e1"
                value={formState.amount}
                onChangeText={(t) => updateCache({ amount: t })}
                keyboardType="numeric"
                className="flex-1 text-lg font-extrabold text-slate-800"
              />
            </View>
          </Animated.View>

          <Animated.View
            entering={reducedMotion ? undefined : FadeInDown.delay(120).duration(300)}
            className="mb-6 flex-row flex-wrap gap-2">
            {quickAmounts.map((amt) => {
              const isSelected = formState.amount === String(amt);
              return (
                <Pressable
                  key={amt}
                  onPress={() => updateCache({ amount: String(amt) })}
                  className={`rounded-2xl border px-5 py-2.5 ${isSelected ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 bg-white'}`}>
                  <Text
                    className={`text-xs font-bold ${isSelected ? 'text-indigo-700' : 'text-slate-600'}`}>
                    ₹{amt.toLocaleString('en-IN')}
                  </Text>
                </Pressable>
              );
            })}
          </Animated.View>

          <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(160).duration(300)}>
            <Pressable
              onPress={() => {
                if (!formState.amount || parseFloat(formState.amount) <= 0) {
                  toast.error('Please input a valid amount');
                  return;
                }
                updateCache({ confirmVisible: true });
              }}>
              <LinearGradient
                colors={['#10b981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="flex-row items-center justify-center gap-2 rounded-2xl py-4 shadow-lg">
                <CreditCard size={18} color="white" strokeWidth={2.5} />
                <Text className="text-sm font-bold text-white">
                  Authorize Clearance of ₹
                  {parseFloat(formState.amount || '0').toLocaleString('en-IN')}
                </Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </ScrollView>
      )}

      <PaymentConfirmSheet
        visible={formState.confirmVisible}
        billerName={formState.selectedBiller?.billerName ?? ''}
        consumerNumber={primaryValue}
        amount={formState.amount}
        onConfirm={() => payBillMutation.mutate()}
        onCancel={() => updateCache({ confirmVisible: false })}
        isLoading={payBillMutation.isPending}
      />
    </View>
  );
};

export default BBPSBillScreen;
