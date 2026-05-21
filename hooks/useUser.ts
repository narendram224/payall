import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/user/user.service';
import { CommissionData, User } from '@/services/user/user.dto';

const STALE_TIME = 5 * 60 * 1000; // 5 minutes

export function useUser() {
  const { data: user, isLoading, refetch } = useQuery<User>({
    queryKey: ['user'],
    queryFn: () => userService.getUser(),
    staleTime: STALE_TIME,
  });

  const walletBalance = user?.wallet_balance ?? '0';

  return {
    user: user ?? null,
    walletBalance,
    isLoading,
    refetch,
  };
}

export function useCommission() {
  const { data, isLoading } = useQuery<{ status_id: number; data: CommissionData; message: string }>({
    queryKey: ['commission'],
    queryFn: () => userService.getCommission(),
    staleTime: STALE_TIME,
  });

  return {
    commission: data?.data ?? null,
    isLoading,
  };
}
