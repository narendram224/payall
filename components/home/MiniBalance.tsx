import { formatINR } from '@/lib/utils';
import { UserInfo } from '@/services/user/user.dto';
import { userService } from '@/services/user/user.service';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';

type UserBalance = {
  user_balance: number;
  aeps_balance: number;
  lien_balance: string;
};

const MiniBalance = () => {
  const {
    data: userInfo,
    isLoading,
    isError,
    refetch,
  } = useQuery<UserInfo>({
    queryKey: ['userInfo'],
    queryFn: () => userService.getUser(),
    staleTime: 5 * 60 * 1000,
  });

  console.log('Is loading:', isLoading);
  console.log('Is error:', isError);
  console.log('User info:', userInfo);

  const displayEmail = userInfo?.email ?? '';
  const displayMobile = userInfo?.mobile ?? '';
  const balance: UserBalance | null = userInfo?.balance ?? null;

  const handleRefresh = useCallback(
    (e: any) => {
      e?.preventDefault?.();
      refetch();
    },
    [refetch]
  );

  return (
    <>
      {balance && (
        <View
          className="mx-4 mb-4 rounded-2xl bg-white p-8 shadow-md shadow-gray-200"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}>
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-base font-semibold text-gray-700">Wallet Overview</Text>
            {isLoading && <ActivityIndicator size="small" color="#00B9F2" />}
          </View>

          {/* Main balance */}
          <View className="mb-5 flex-row items-end justify-between">
            <View>
              <Text className="text-xs font-medium text-gray-400">Available Balance</Text>
              <Text className="mt-0.5 text-3xl font-bold text-gray-900">
                {formatINR(balance.user_balance)}
              </Text>
            </View>
            <View className="rounded-xl px-3 py-1.5" style={{ backgroundColor: '#E8F7FD' }}>
              <Text className="text-xs font-semibold" style={{ color: '#00B9F2' }}>
                {displayEmail}
              </Text>
            </View>
          </View>

          {/* Sub balances row */}
          <View className="flex-row justify-between border-t border-gray-100 pt-4">
            <View className="flex-1 items-start">
              <Text className="text-xs text-gray-400">AEPS Balance</Text>
              <Text className="mt-1 text-base font-bold text-gray-800">
                {formatINR(balance.aeps_balance)}
              </Text>
            </View>
            <View className="flex-1 items-center border-l border-gray-100 pl-4">
              <Text className="text-xs text-gray-400">Lien Hold</Text>
              <Text className="mt-1 text-base font-bold text-gray-800">
                {balance.lien_balance !== '-' ? `₹ ${balance.lien_balance}` : '—'}
              </Text>
            </View>
            <View className="flex-1 items-end border-l border-gray-100 pl-4">
              <Text className="text-xs text-gray-400">UIN</Text>
              <Text className="mt-1 text-base font-bold text-gray-800">{displayMobile ?? '—'}</Text>
            </View>
          </View>
        </View>
      )}

      {/* ── Loading placeholder ───────────────────────────────────────── */}
      {isLoading && !userInfo && (
        <View
          className="mx-4 mt-4 items-center rounded-2xl bg-gray-50 py-10"
          style={{ zIndex: 14 }}>
          <ActivityIndicator size="large" color="#00B9F2" />
          <Text className="mt-3 text-sm text-gray-400">Loading profile…</Text>
        </View>
      )}

      {/* ── Error placeholder ─────────────────────────────────────────── */}
      {isError && !userInfo && (
        <View className="mx-4 mt-4 items-center rounded-2xl bg-red-50 py-6" style={{ zIndex: 14 }}>
          <Text className="text-sm font-medium text-red-500">Unable to load profile</Text>
          <Pressable onPress={handleRefresh} className="mt-2 rounded-full bg-red-100 px-5 py-2">
            <Text className="text-xs font-semibold text-red-600">Retry</Text>
          </Pressable>
        </View>
      )}
    </>
  );
};

export default MiniBalance;
