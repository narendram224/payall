import React, { useState } from 'react';
import { View, ScrollView, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeIn, useReducedMotion } from 'react-native-reanimated';
import { toast } from 'react-native-sonner';
import { verificationService } from '@/services/verification/verification.service';
import { CheckCircle, XCircle, Search } from 'lucide-react-native';

type Tool = 'aadhaar' | 'pan' | 'upi' | 'bank' | 'gst' | 'ifsc' | 'challan' | null;

const TOOLS = [
  {
    id: 'aadhaar',
    title: 'Aadhaar',
    desc: 'Verify Aadhaar with OTP',
    emoji: '🪪',
    gradient: ['#3b82f6', '#6366f1'] as [string, string],
  },
  {
    id: 'pan',
    title: 'PAN Card',
    desc: 'Verify PAN number',
    emoji: '🗂️',
    gradient: ['#f59e0b', '#f97316'] as [string, string],
  },
  {
    id: 'upi',
    title: 'UPI ID',
    desc: 'Verify UPI address',
    emoji: '💳',
    gradient: ['#10b981', '#059669'] as [string, string],
  },
  {
    id: 'bank',
    title: 'Bank Account',
    desc: 'Penny drop verification',
    emoji: '🏦',
    gradient: ['#8b5cf6', '#a855f7'] as [string, string],
  },
  {
    id: 'gst',
    title: 'GST Number',
    desc: 'Verify GSTIN',
    emoji: '📋',
    gradient: ['#14b8a6', '#06b6d4'] as [string, string],
  },
  {
    id: 'ifsc',
    title: 'IFSC Code',
    desc: 'Bank branch details',
    emoji: '🔍',
    gradient: ['#6366f1', '#8b5cf6'] as [string, string],
  },
  {
    id: 'challan',
    title: 'Challan',
    desc: 'Traffic challan check',
    emoji: '🚦',
    gradient: ['#ef4444', '#dc2626'] as [string, string],
  },
];

function ResultCard({ data, success }: { data: Record<string, any>; success: boolean }) {
  const reducedMotion = useReducedMotion();
  return (
    <Animated.View
      entering={reducedMotion ? undefined : FadeInDown.duration(350)}
      className="mt-4 overflow-hidden rounded-2xl border border-border">
      <LinearGradient
        colors={success ? ['#10b981', '#059669'] : ['#ef4444', '#dc2626']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-row items-center gap-2 px-4 py-3">
        {success ? <CheckCircle size={18} color="white" /> : <XCircle size={18} color="white" />}
        <Text className="font-bold text-white">
          {success ? 'Verified Successfully' : 'Verification Failed'}
        </Text>
      </LinearGradient>
      <View className="bg-card px-4 py-4">
        {Object.entries(data)
          .filter(([k]) => k !== 'status_id')
          .map(([key, val]) => (
            <View key={key} className="mb-2 flex-row justify-between">
              <Text className="text-sm text-muted-foreground">
                {key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </Text>
              <Text className="ml-4 flex-1 text-right text-sm font-semibold text-foreground">
                {String(val ?? '-')}
              </Text>
            </View>
          ))}
      </View>
    </Animated.View>
  );
}

function InputField({ label, value, onChange, placeholder, keyboard = 'default', maxLen }: any) {
  return (
    <View className="mb-4">
      <Text className="mb-1.5 text-sm font-semibold text-foreground">{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        value={value}
        onChangeText={onChange}
        keyboardType={keyboard}
        maxLength={maxLen}
        autoCapitalize="characters"
        className="rounded-xl border border-border bg-card px-4 py-3.5 text-sm text-foreground"
      />
    </View>
  );
}

export default function VerificationHub() {
  const reducedMotion = useReducedMotion();
  const [activeTool, setActiveTool] = useState<Tool>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Per-tool state
  const [aadhaar, setAadhaar] = useState('');
  const [aadhaarOtp, setAadhaarOtp] = useState('');
  const [aadhaarRefId, setAadhaarRefId] = useState('');
  const [aadhaarStep, setAadhaarStep] = useState<'input' | 'otp'>('input');

  const [pan, setPan] = useState('');
  const [upi, setUpi] = useState('');
  const [account, setAccount] = useState('');
  const [ifscForBank, setIfscForBank] = useState('');
  const [gst, setGst] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [challan, setChallan] = useState('');
  const [challanState, setChallanState] = useState('');

  const clearResult = () => {
    setResult(null);
    setAadhaarStep('input');
    setAadhaarRefId('');
  };

  const GradientBtn = ({ label, onPress, disabled }: any) => (
    <Pressable onPress={onPress} disabled={disabled} className="mt-2">
      <LinearGradient
        colors={disabled ? ['#94a3b8', '#94a3b8'] : ['#6366f1', '#8b5cf6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="items-center rounded-2xl py-4">
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-base font-bold text-white">{label}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );

  // ── Handlers ──
  const handleAadhaarOtp = async () => {
    if (!aadhaar || aadhaar.length !== 12) {
      toast.error('Enter valid 12-digit Aadhaar');
      return;
    }
    try {
      setLoading(true);
      const r: any = await verificationService.sendAadhaarOtp(aadhaar);
      if (r?.status_id === 1) {
        setAadhaarRefId(r?.data?.ref_id ?? '');
        setAadhaarStep('otp');
        toast.success('OTP sent');
      } else {
        toast.error(r?.message ?? 'Failed');
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleAadhaarVerify = async () => {
    if (!aadhaarOtp) {
      toast.error('Enter OTP');
      return;
    }
    try {
      setLoading(true);
      const r: any = await verificationService.verifyAadhaarOtp({
        aadhaar_number: aadhaar,
        otp: aadhaarOtp,
        ref_id: aadhaarRefId,
      });
      setResult({ success: r?.status_id === 1, data: r?.data ?? r });
    } catch (e: any) {
      setResult({
        success: false,
        data: { message: e?.response?.data?.message ?? 'Verification failed' },
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePAN = async () => {
    if (!pan || pan.length !== 10) {
      toast.error('Enter valid 10-char PAN');
      return;
    }
    try {
      setLoading(true);
      const r: any = await verificationService.verifyPan(pan.toUpperCase());
      setResult({ success: r?.status_id === 1, data: r?.data ?? r });
    } catch (e: any) {
      setResult({ success: false, data: { error: e?.response?.data?.message ?? 'Failed' } });
    } finally {
      setLoading(false);
    }
  };

  const handleUPI = async () => {
    if (!upi || !upi.includes('@')) {
      toast.error('Enter valid UPI ID (e.g. name@upi)');
      return;
    }
    try {
      setLoading(true);
      const r: any = await verificationService.verifyUpi(upi);
      setResult({ success: r?.status_id === 1, data: r?.data ?? r });
    } catch (e: any) {
      setResult({ success: false, data: { error: e?.response?.data?.message ?? 'Failed' } });
    } finally {
      setLoading(false);
    }
  };

  const handleBank = async () => {
    if (!account || !ifscForBank || ifscForBank.length !== 11) {
      toast.error('Enter valid account and IFSC');
      return;
    }
    try {
      setLoading(true);
      const r: any = await verificationService.verifyBankAccount({
        account_number: account,
        ifsc: ifscForBank.toUpperCase(),
      });
      setResult({ success: r?.status_id === 1, data: r?.data ?? r });
    } catch (e: any) {
      setResult({ success: false, data: { error: e?.response?.data?.message ?? 'Failed' } });
    } finally {
      setLoading(false);
    }
  };

  const handleGST = async () => {
    if (!gst || gst.length !== 15) {
      toast.error('Enter valid 15-char GSTIN');
      return;
    }
    try {
      setLoading(true);
      const r: any = await verificationService.verifyGst(gst.toUpperCase());
      setResult({ success: r?.status_id === 1, data: r?.data ?? r });
    } catch (e: any) {
      setResult({ success: false, data: { error: e?.response?.data?.message ?? 'Failed' } });
    } finally {
      setLoading(false);
    }
  };

  const handleIFSC = async () => {
    if (!ifsc || ifsc.length !== 11) {
      toast.error('Enter valid 11-char IFSC');
      return;
    }
    try {
      setLoading(true);
      const r: any = await verificationService.verifyIfsc(ifsc.toUpperCase());
      setResult({ success: r?.status_id === 1, data: r?.data ?? r });
    } catch (e: any) {
      setResult({ success: false, data: { error: e?.response?.data?.message ?? 'Failed' } });
    } finally {
      setLoading(false);
    }
  };

  const handleChallan = async () => {
    if (!challan) {
      toast.error('Enter challan number');
      return;
    }
    try {
      setLoading(true);
      const r: any = await verificationService.verifyChallan({
        challan_number: challan,
        state: challanState,
      });
      setResult({ success: r?.status_id === 1, data: r?.data ?? r });
    } catch (e: any) {
      setResult({ success: false, data: { error: e?.response?.data?.message ?? 'Failed' } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={['#6366f1', '#8b5cf6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-4 pb-6 pt-4">
        <Text className="text-xl font-bold text-white">Verification Suite</Text>
        <Text className="mt-0.5 text-sm text-white/70">Verify identity documents instantly</Text>
      </LinearGradient>

      <ScrollView
        className="flex-1 px-4 pt-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Tool Grid */}
        {!activeTool && (
          <View className="flex-row flex-wrap gap-3">
            {TOOLS.map((t, i) => (
              <Animated.View
                key={t.id}
                entering={reducedMotion ? undefined : FadeInDown.delay(i * 60).duration(300)}
                style={{ width: '47%' }}>
                <Pressable
                  onPress={() => {
                    setActiveTool(t.id as Tool);
                    clearResult();
                  }}
                  className="overflow-hidden rounded-2xl">
                  <LinearGradient
                    colors={t.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="p-4">
                    <Text className="mb-2 text-3xl">{t.emoji}</Text>
                    <Text className="text-base font-bold text-white">{t.title}</Text>
                    <Text className="mt-0.5 text-xs text-white/70">{t.desc}</Text>
                  </LinearGradient>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        )}

        {/* Active Tool Form */}
        {activeTool && (
          <Animated.View entering={reducedMotion ? undefined : FadeIn.duration(300)}>
            <View className="mb-5 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-foreground">
                {TOOLS.find((t) => t.id === activeTool)?.title} Verification
              </Text>
              <Pressable
                onPress={() => {
                  setActiveTool(null);
                  clearResult();
                }}
                className="rounded-full border border-border px-4 py-2">
                <Text className="text-sm font-semibold text-foreground">← Back</Text>
              </Pressable>
            </View>

            {activeTool === 'aadhaar' && (
              <>
                {aadhaarStep === 'input' && (
                  <>
                    <InputField
                      label="Aadhaar Number"
                      value={aadhaar}
                      onChange={setAadhaar}
                      placeholder="12-digit Aadhaar"
                      keyboard="numeric"
                      maxLen={12}
                    />
                    <GradientBtn label="Send OTP" onPress={handleAadhaarOtp} disabled={loading} />
                  </>
                )}
                {aadhaarStep === 'otp' && (
                  <>
                    <View className="mb-4 rounded-xl bg-blue-50 p-3">
                      <Text className="text-sm text-blue-700">
                        OTP sent to Aadhaar-linked mobile
                      </Text>
                    </View>
                    <InputField
                      label="Enter OTP"
                      value={aadhaarOtp}
                      onChange={setAadhaarOtp}
                      placeholder="6-digit OTP"
                      keyboard="numeric"
                      maxLen={6}
                    />
                    <GradientBtn
                      label="Verify OTP"
                      onPress={handleAadhaarVerify}
                      disabled={loading}
                    />
                  </>
                )}
              </>
            )}
            {activeTool === 'pan' && (
              <>
                <InputField
                  label="PAN Number"
                  value={pan}
                  onChange={(t: string) => setPan(t.toUpperCase())}
                  placeholder="e.g. ABCDE1234F"
                  maxLen={10}
                />
                <GradientBtn label="Verify PAN" onPress={handlePAN} disabled={loading} />
              </>
            )}
            {activeTool === 'upi' && (
              <>
                <InputField
                  label="UPI ID"
                  value={upi}
                  onChange={setUpi}
                  placeholder="e.g. name@bank"
                  keyboard="default"
                />
                <GradientBtn label="Verify UPI" onPress={handleUPI} disabled={loading} />
              </>
            )}
            {activeTool === 'bank' && (
              <>
                <InputField
                  label="Account Number"
                  value={account}
                  onChange={setAccount}
                  placeholder="Bank account number"
                  keyboard="numeric"
                  maxLen={20}
                />
                <InputField
                  label="IFSC Code"
                  value={ifscForBank}
                  onChange={(t: string) => setIfscForBank(t.toUpperCase())}
                  placeholder="e.g. SBIN0001234"
                  maxLen={11}
                />
                <GradientBtn label="Verify Bank Account" onPress={handleBank} disabled={loading} />
              </>
            )}
            {activeTool === 'gst' && (
              <>
                <InputField
                  label="GSTIN"
                  value={gst}
                  onChange={(t: string) => setGst(t.toUpperCase())}
                  placeholder="15-character GSTIN"
                  maxLen={15}
                />
                <GradientBtn label="Verify GST" onPress={handleGST} disabled={loading} />
              </>
            )}
            {activeTool === 'ifsc' && (
              <>
                <InputField
                  label="IFSC Code"
                  value={ifsc}
                  onChange={(t: string) => setIfsc(t.toUpperCase())}
                  placeholder="e.g. SBIN0001234"
                  maxLen={11}
                />
                <GradientBtn label="Get Bank Details" onPress={handleIFSC} disabled={loading} />
              </>
            )}
            {activeTool === 'challan' && (
              <>
                <InputField
                  label="Challan Number"
                  value={challan}
                  onChange={setChallan}
                  placeholder="Vehicle challan number"
                />
                <InputField
                  label="State"
                  value={challanState}
                  onChange={setChallanState}
                  placeholder="e.g. DL, MH, UP"
                  maxLen={2}
                />
                <GradientBtn label="Check Challan" onPress={handleChallan} disabled={loading} />
              </>
            )}

            {result && <ResultCard data={result.data ?? {}} success={result.success} />}
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}
