import { useMutation } from '@tanstack/react-query';
import {
  verificationService,
  VerificationResponse,
  AadhaarOtpData,
  AadhaarData,
  PanData,
  UpiData,
  BankData,
  GstData,
  IfscData,
  ChallanData,
  VerifyBankAccountData,
  VerifyChallanData,
} from '@/services/verification/verification.service';

export function useSendAadhaarOtp() {
  const mutation = useMutation<VerificationResponse<AadhaarOtpData>, Error, string>({
    mutationFn: (aadhaar: string) => verificationService.sendAadhaarOtp(aadhaar),
  });

  return {
    sendAadhaarOtp: mutation.mutateAsync,
    isLoading: mutation.isPending,
    data: mutation.data ?? null,
    error: mutation.error,
    reset: mutation.reset,
  };
}

export function useVerifyAadhaarOtp() {
  const mutation = useMutation<
    VerificationResponse<AadhaarData>,
    Error,
    { aadhaar_number: string; otp: string; ref_id: string }
  >({
    mutationFn: (data) => verificationService.verifyAadhaarOtp(data),
  });

  return {
    verifyAadhaarOtp: mutation.mutateAsync,
    isLoading: mutation.isPending,
    data: mutation.data ?? null,
    error: mutation.error,
    reset: mutation.reset,
  };
}

export function useVerifyPan() {
  const mutation = useMutation<VerificationResponse<PanData>, Error, string>({
    mutationFn: (pan: string) => verificationService.verifyPan(pan),
  });

  return {
    verifyPan: mutation.mutateAsync,
    isLoading: mutation.isPending,
    data: mutation.data ?? null,
    error: mutation.error,
    reset: mutation.reset,
  };
}

export function useVerifyUpi() {
  const mutation = useMutation<VerificationResponse<UpiData>, Error, string>({
    mutationFn: (upi: string) => verificationService.verifyUpi(upi),
  });

  return {
    verifyUpi: mutation.mutateAsync,
    isLoading: mutation.isPending,
    data: mutation.data ?? null,
    error: mutation.error,
    reset: mutation.reset,
  };
}

export function useVerifyBankAccount() {
  const mutation = useMutation<VerificationResponse<BankData>, Error, VerifyBankAccountData>({
    mutationFn: (data: VerifyBankAccountData) => verificationService.verifyBankAccount(data),
  });

  return {
    verifyBankAccount: mutation.mutateAsync,
    isLoading: mutation.isPending,
    data: mutation.data ?? null,
    error: mutation.error,
    reset: mutation.reset,
  };
}

export function useVerifyGst() {
  const mutation = useMutation<VerificationResponse<GstData>, Error, string>({
    mutationFn: (gst: string) => verificationService.verifyGst(gst),
  });

  return {
    verifyGst: mutation.mutateAsync,
    isLoading: mutation.isPending,
    data: mutation.data ?? null,
    error: mutation.error,
    reset: mutation.reset,
  };
}

export function useChallanVerify() {
  const mutation = useMutation<VerificationResponse<ChallanData>, Error, VerifyChallanData>({
    mutationFn: (data: VerifyChallanData) => verificationService.verifyChallan(data),
  });

  return {
    challanVerify: mutation.mutateAsync,
    isLoading: mutation.isPending,
    data: mutation.data ?? null,
    error: mutation.error,
    reset: mutation.reset,
  };
}

export function useVerifyIfsc() {
  const mutation = useMutation<VerificationResponse<IfscData>, Error, string>({
    mutationFn: (ifsc: string) => verificationService.verifyIfsc(ifsc),
  });

  return {
    verifyIfsc: mutation.mutateAsync,
    isLoading: mutation.isPending,
    data: mutation.data ?? null,
    error: mutation.error,
    reset: mutation.reset,
  };
}
