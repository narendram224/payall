import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  payoutService,
  Beneficiary,
  Customer,
  AddCustomerData,
  ConfirmCustomerData,
  UpiTransferData,
  BankTransferData,
  PayoutResponse,
} from '@/services/payout/payout.service';

const STALE_TIME = 5 * 60 * 1000; // 5 minutes

export function useBeneficiaries(mobile: string) {
  const { data, isLoading, refetch } = useQuery<Beneficiary[]>({
    queryKey: ['beneficiaries', mobile],
    queryFn: () => payoutService.getBeneficiaries(mobile),
    enabled: !!mobile,
    staleTime: STALE_TIME,
  });

  return {
    beneficiaries: data ?? [],
    isLoading,
    refetch,
  };
}

export function useGetCustomer() {
  const mutation = useMutation<Customer, Error, string>({
    mutationFn: (mobile: string) => payoutService.getCustomer(mobile),
  });

  return {
    getCustomer: mutation.mutateAsync,
    customer: mutation.data ?? null,
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}

export function useAddCustomer() {
  const mutation = useMutation<any, Error, AddCustomerData>({
    mutationFn: (data: AddCustomerData) => payoutService.addCustomer(data),
  });

  return {
    addCustomer: mutation.mutateAsync,
    isLoading: mutation.isPending,
    data: mutation.data ?? null,
    error: mutation.error,
    reset: mutation.reset,
  };
}

export function useConfirmCustomer() {
  const mutation = useMutation<any, Error, ConfirmCustomerData>({
    mutationFn: (data: ConfirmCustomerData) => payoutService.confirmCustomer(data),
  });

  return {
    confirmCustomer: mutation.mutateAsync,
    isLoading: mutation.isPending,
    data: mutation.data ?? null,
    error: mutation.error,
    reset: mutation.reset,
  };
}

export function useUpiTransfer() {
  const queryClient = useQueryClient();

  const mutation = useMutation<PayoutResponse, Error, UpiTransferData>({
    mutationFn: (data: UpiTransferData) => payoutService.upiTransfer(data),
    onSuccess: () => {
      // Refresh user balance after a successful transfer
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  return {
    upiTransfer: mutation.mutateAsync,
    isLoading: mutation.isPending,
    data: mutation.data ?? null,
    error: mutation.error,
    reset: mutation.reset,
  };
}

export function useBankTransfer() {
  const queryClient = useQueryClient();

  const mutation = useMutation<PayoutResponse, Error, BankTransferData>({
    mutationFn: (data: BankTransferData) => payoutService.bankTransfer(data),
    onSuccess: (_, variables) => {
      // Refresh user balance and beneficiary list after a successful transfer
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['beneficiaries', variables.mobile_number] });
    },
  });

  return {
    bankTransfer: mutation.mutateAsync,
    isLoading: mutation.isPending,
    data: mutation.data ?? null,
    error: mutation.error,
    reset: mutation.reset,
  };
}
