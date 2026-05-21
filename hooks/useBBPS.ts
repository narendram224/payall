import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  bbpsService,
} from '@/services/bbps/bbps.service';
import { BBPSBiller, BBPSCategory, BillFetchRequest, BillFetchResponse, BillPayRequest, BillPayResponse } from '@/services/bbps/bbps.dto';

const STALE_TIME = 5 * 60 * 1000; // 5 minutes

export function useBBPSCategories() {
  const { data, isLoading } = useQuery<BBPSCategory[]>({
    queryKey: ['bbps-categories'],
    queryFn: () => bbpsService.getCategories(),
    staleTime: STALE_TIME,
  });

  return {
    categories: data ?? [],
    isLoading,
  };
}

export function useBBPSCategoryBillers(slug: string) {
  const { data, isLoading } = useQuery<BBPSBiller[]>({
    queryKey: ['bbps-billers', slug],
    queryFn: () => bbpsService.getCategoryBySlug(slug),
    enabled: !!slug,
    staleTime: STALE_TIME,
  });

  return {
    billers: data ?? [],
    isLoading,
  };
}

export function useBBPSBiller(billerId: string, enabled: boolean = true) {
  const { data, isLoading } = useQuery<BBPSBiller>({
    queryKey: ['bbps-biller', billerId],
    queryFn: () => bbpsService.getBiller(billerId),
    enabled: !!billerId && enabled,
    staleTime: STALE_TIME,
  });

  return {
    biller: data ?? null,
    isLoading,
  };
}

export function useFetchBill() {
  const mutation = useMutation<BillFetchResponse, Error, BillFetchRequest>({
    mutationFn: (data: BillFetchRequest) => bbpsService.fetchBill(data),
  });

  return {
    fetchBill: mutation.mutateAsync,
    billDetails: mutation.data?.data ?? null,
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}

export function usePayBill() {
  const queryClient = useQueryClient();

  const mutation = useMutation<BillPayResponse, Error, BillPayRequest>({
    mutationFn: (data: BillPayRequest) => bbpsService.payBill(data),
    onSuccess: () => {
      // Invalidate user balance after a successful bill payment
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  return {
    payBill: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    data: mutation.data ?? null,
    reset: mutation.reset,
  };
}
