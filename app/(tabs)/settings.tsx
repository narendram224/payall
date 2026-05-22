import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/user/user.service';
import { useAuth } from '../../hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronRight,
  CheckCircle2,
  Landmark,
  CreditCard,
  Zap,
  QrCode,
  RefreshCw,
  Heart,
  LogOut,
  Gift,
  Users,
  Building2,
  Hash,
  Mail,
  ShieldCheck,
  ShieldAlert,
  Wallet,
  BadgeCheck,
} from 'lucide-react-native';

export default function SettingsScreen() {
  const { logout } = useAuth();

  const { data: userInfo, isLoading } = useQuery({
    queryKey: ['userInfo'],
    queryFn: () => userService.getUser(),
    staleTime: 5 * 60 * 1000,
  });

  const isKycVerified = userInfo?.profile?.kyc === 1;
  const formattedBalance = userInfo?.balance?.user_balance != null
    ? `₹${Number(userInfo.balance.user_balance).toFixed(2)}`
    : '₹0.00';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Top Profile Section ── */}
        <View style={styles.profileSection}>
          {/* Decorative gradient blobs */}
          <View style={styles.blobTopRight} />
          <View style={styles.blobBottomLeft} />

          {/* Top row: name + avatar */}
          <View style={styles.profileTopRow}>
            <View style={styles.profileInfo}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#8CE1CD" style={styles.loadingIndicator} />
              ) : (
                <Text style={styles.nameText} numberOfLines={1}>
                  {userInfo?.name ?? 'Loading...'}
                </Text>
              )}

              {/* Role badge */}
              {userInfo?.role?.role_title ? (
                <View style={styles.roleBadge}>
                  <BadgeCheck size={13} color="#8CE1CD" />
                  <Text style={styles.roleBadgeText}>{userInfo.role.role_title}</Text>
                </View>
              ) : null}

              {/* UPI ID */}
              <View style={styles.upiContainer}>
                <Text style={styles.upiLabel}>UPI ID</Text>
                <Text style={styles.upiText} numberOfLines={1}>
                  {isLoading ? '—' : (userInfo?.bank_account?.data?.virtual_upi ?? 'Setting up...')}
                </Text>
              </View>

              {/* Phone + UPI badge */}
              <View style={styles.phoneContainer}>
                <Text style={styles.phoneText}>
                  {isLoading ? '—' : (userInfo?.mobile ?? '')}
                </Text>
                <View style={styles.upiBadge}>
                  <CheckCircle2 size={13} color="#fff" />
                  <Text style={styles.upiBadgeText}>UPI number</Text>
                </View>
              </View>
            </View>

            {/* Avatar */}
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{
                    uri: userInfo?.image
                      ? userInfo.image
                      : `https://i.pravatar.cc/150?u=${userInfo?.mobile ?? 'default'}`,
                  }}
                  style={styles.avatar}
                />
                <View style={styles.qrBadge}>
                  <QrCode size={15} color="#fff" />
                </View>
              </View>
            </View>
          </View>

          {/* Balance pill */}
          <View style={styles.balancePill}>
            <Wallet size={16} color="#8CE1CD" />
            <Text style={styles.balancePillLabel}>Wallet Balance</Text>
            <Text style={styles.balancePillValue}>
              {isLoading ? '—' : formattedBalance}
            </Text>
          </View>
        </View>

        {/* ── Rewards Row ── */}
        <View style={styles.rewardsRow}>
          <TouchableOpacity style={[styles.rewardCard, { backgroundColor: '#3A2C4A' }]} activeOpacity={0.8}>
            <Gift size={24} color="#D1B2FF" />
            <View style={styles.rewardTextContainer}>
              <Text style={styles.rewardTitle}>2 rewards</Text>
              <Text style={styles.rewardSubtitle}>View now</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.rewardCard, { backgroundColor: '#213B44' }]} activeOpacity={0.8}>
            <Users size={24} color="#8CE1CD" />
            <View style={styles.rewardTextContainer}>
              <Text style={styles.rewardTitle}>Get ₹151</Text>
              <Text style={styles.rewardSubtitle}>Refer a friend</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Account Details Card ── */}
        <View style={styles.accountDetailsCard}>
          <Text style={styles.sectionTitle}>Account Details</Text>

          {/* Virtual Account Number */}
          <View style={styles.accountDetailRow}>
            <View style={styles.accountDetailIconWrap}>
              <Building2 size={18} color="#A8C7FA" />
            </View>
            <View style={styles.accountDetailTextWrap}>
              <Text style={styles.accountDetailLabel}>Virtual Account No.</Text>
              <Text style={styles.accountDetailValue} numberOfLines={1}>
                {isLoading
                  ? '—'
                  : (userInfo?.bank_account?.data?.virtual_account_number ?? 'Not assigned')}
              </Text>
            </View>
          </View>

          <View style={styles.detailDivider} />

          {/* Virtual IFSC */}
          <View style={styles.accountDetailRow}>
            <View style={styles.accountDetailIconWrap}>
              <Hash size={18} color="#A8C7FA" />
            </View>
            <View style={styles.accountDetailTextWrap}>
              <Text style={styles.accountDetailLabel}>Virtual IFSC</Text>
              <Text style={styles.accountDetailValue}>
                {isLoading
                  ? '—'
                  : (userInfo?.bank_account?.data?.virtual_ifsc ?? 'Not assigned')}
              </Text>
            </View>
          </View>

          <View style={styles.detailDivider} />

          {/* Email */}
          <View style={styles.accountDetailRow}>
            <View style={styles.accountDetailIconWrap}>
              <Mail size={18} color="#A8C7FA" />
            </View>
            <View style={styles.accountDetailTextWrap}>
              <Text style={styles.accountDetailLabel}>Email</Text>
              <Text style={styles.accountDetailValue} numberOfLines={1}>
                {isLoading ? '—' : (userInfo?.email ?? 'Not set')}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Payment Methods ── */}
        <View style={styles.paymentMethodsContainer}>
          <View style={styles.paymentMethodsHeader}>
            <Text style={styles.paymentMethodsTitle}>Set up payment methods 1/3</Text>
            <ChevronRight size={20} color="#A0A0A0" />
          </View>

          <View style={styles.paymentMethodsList}>
            <TouchableOpacity style={styles.paymentMethodItem} activeOpacity={0.7}>
              <View style={styles.paymentMethodIconWrapper}>
                <Landmark size={24} color="#A8C7FA" />
              </View>
              <Text style={styles.paymentMethodName}>Bank account</Text>
              <Text style={styles.paymentMethodDesc}>1 account</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.paymentMethodItem} activeOpacity={0.7}>
              <View style={[styles.paymentMethodIconWrapper, styles.dashedBorder]}>
                <CreditCard size={24} color="#A8C7FA" />
                <View style={styles.addBadge}>
                  <Text style={styles.addBadgeText}>+</Text>
                </View>
              </View>
              <Text style={styles.paymentMethodName}>RuPay credit card</Text>
              <Text style={styles.paymentMethodDesc}>Pay with UPI</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.paymentMethodItem} activeOpacity={0.7}>
              <View style={[styles.paymentMethodIconWrapper, styles.dashedBorder]}>
                <Zap size={24} color="#A8C7FA" />
                <View style={styles.addBadge}>
                  <Text style={styles.addBadgeText}>+</Text>
                </View>
              </View>
              <Text style={styles.paymentMethodName}>UPI Lite</Text>
              <Text style={styles.paymentMethodDesc}>Pay PIN-free</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Menu List ── */}
        <View style={styles.menuContainer}>
          {/* Your QR Code */}
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={[styles.menuIconWrap, { backgroundColor: '#1A2840' }]}>
              <QrCode size={20} color="#A8C7FA" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Your QR code</Text>
              <Text style={styles.menuSubtitle}>Use to receive money from any UPI app</Text>
            </View>
            <ChevronRight size={18} color="#555" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* Autopay */}
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={[styles.menuIconWrap, { backgroundColor: '#1A2840' }]}>
              <RefreshCw size={20} color="#A8C7FA" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Autopay</Text>
              <Text style={styles.menuSubtitle}>No pending requests</Text>
            </View>
            <ChevronRight size={18} color="#555" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* KYC Status */}
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={[
              styles.menuIconWrap,
              { backgroundColor: isKycVerified ? '#0F2D1A' : '#2D1A0F' },
            ]}>
              {isKycVerified
                ? <ShieldCheck size={20} color="#4ADE80" />
                : <ShieldAlert size={20} color="#FB923C" />
              }
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>KYC Status</Text>
              <Text style={styles.menuSubtitle}>
                {isLoading
                  ? 'Checking...'
                  : isKycVerified
                    ? 'Your KYC is verified'
                    : 'KYC verification pending'}
              </Text>
            </View>
            <View style={[
              styles.kycStatusBadge,
              { backgroundColor: isKycVerified ? '#14532D' : '#431407' },
            ]}>
              <Text style={[
                styles.kycStatusText,
                { color: isKycVerified ? '#4ADE80' : '#FB923C' },
              ]}>
                {isLoading ? '—' : isKycVerified ? 'Verified' : 'Pending'}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* Pocket money */}
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={[styles.menuIconWrap, { backgroundColor: '#1A1A2D' }]}>
              <Heart size={20} color="#C084FC" />
            </View>
            <View style={styles.menuTextContainer}>
              <View style={styles.menuTitleRow}>
                <Text style={styles.menuTitle}>Set up pocket money</Text>
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>New</Text>
                </View>
              </View>
              <Text style={styles.menuSubtitle}>Let your loved ones pay using UPI Circle</Text>
            </View>
            <ChevronRight size={18} color="#555" />
          </TouchableOpacity>
        </View>

        {/* ── Logout ── */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout} activeOpacity={0.8}>
          <LogOut size={20} color="#EF4444" />
          <View style={styles.logoutTextWrap}>
            <Text style={styles.logoutTitle}>Logout</Text>
            <Text style={styles.logoutSubtitle}>Sign out of your account</Text>
          </View>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#131313',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#131313',
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // ── Profile Section ──
  profileSection: {
    backgroundColor: '#1E2822',
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  blobTopRight: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(140,225,205,0.07)',
  },
  blobBottomLeft: {
    position: 'absolute',
    bottom: -20,
    left: 10,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(140,225,205,0.05)',
  },
  profileTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  profileInfo: {
    flex: 1,
    paddingRight: 16,
    justifyContent: 'center',
  },
  loadingIndicator: {
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  nameText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(140,225,205,0.12)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(140,225,205,0.2)',
  },
  roleBadgeText: {
    color: '#8CE1CD',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  upiContainer: {
    marginBottom: 10,
  },
  upiLabel: {
    color: '#607060',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  upiText: {
    color: '#C8D8C8',
    fontSize: 14,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  phoneText: {
    color: '#C8D8C8',
    fontSize: 14,
  },
  upiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A56D0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 5,
  },
  upiBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },

  // Avatar
  avatarWrapper: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'rgba(140,225,205,0.3)',
  },
  qrBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#2A3F36',
    borderRadius: 16,
    padding: 6,
    borderWidth: 2,
    borderColor: '#1E2822',
  },

  // Balance pill
  balancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(140,225,205,0.08)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(140,225,205,0.15)',
  },
  balancePillLabel: {
    color: '#8A9F8A',
    fontSize: 13,
    flex: 1,
  },
  balancePillValue: {
    color: '#8CE1CD',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // ── Rewards Row ──
  rewardsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 20,
    gap: 12,
  },
  rewardCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    gap: 12,
  },
  rewardTextContainer: {
    flex: 1,
  },
  rewardTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
  rewardSubtitle: {
    color: '#D0D0D0',
    fontSize: 12,
    marginTop: 3,
  },

  // ── Account Details Card ──
  accountDetailsCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  sectionTitle: {
    color: '#888',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  accountDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  accountDetailIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  accountDetailTextWrap: {
    flex: 1,
  },
  accountDetailLabel: {
    color: '#666',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  accountDetailValue: {
    color: '#E0E0E0',
    fontSize: 14,
    fontWeight: '500',
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#242424',
    marginVertical: 12,
  },

  // ── Payment Methods ──
  paymentMethodsContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  paymentMethodsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  paymentMethodsTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
  paymentMethodsList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentMethodItem: {
    alignItems: 'center',
    width: '32%',
  },
  paymentMethodIconWrapper: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#131313',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  dashedBorder: {
    borderWidth: 1.5,
    borderColor: '#444',
    borderStyle: 'dashed',
  },
  addBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#A8C7FA',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1A1A1A',
  },
  addBadgeText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  paymentMethodName: {
    color: '#FFF',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: '500',
  },
  paymentMethodDesc: {
    color: '#A0A0A0',
    fontSize: 11,
    textAlign: 'center',
  },

  // ── Menu Items ──
  menuContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  menuIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 3,
  },
  menuSubtitle: {
    color: '#707070',
    fontSize: 12,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#242424',
    marginLeft: 54,
  },

  // KYC Badge
  kycStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginLeft: 8,
  },
  kycStatusText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // New badge
  newBadge: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 8,
    marginBottom: 3,
  },
  newBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // ── Logout ──
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: '#2D1515',
  },
  logoutTextWrap: {
    flex: 1,
  },
  logoutTitle: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },
  logoutSubtitle: {
    color: '#707070',
    fontSize: 12,
  },
});
