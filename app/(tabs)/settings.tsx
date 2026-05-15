import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
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
  Users
} from 'lucide-react-native';

export default function SettingsScreen() {
  const { theme } = useTheme();
  const { logout } = useAuth();

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: '#131313' }} // Dark background for the GPay feel
      showsVerticalScrollIndicator={false}
    >
      {/* Top Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileInfo}>
          <Text style={styles.nameText}>Narendra Maurya</Text>
          
          <View style={styles.upiContainer}>
            <Text style={styles.upiText}>UPI ID: narendram224@oksbi</Text>
          </View>
          
          <View style={styles.phoneContainer}>
            <Text style={styles.phoneText}>7905325093</Text>
            <View style={styles.upiBadge}>
              <CheckCircle2 size={14} color="#fff" />
              <Text style={styles.upiBadgeText}>UPI number</Text>
            </View>
          </View>
        </View>

        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: 'https://i.pravatar.cc/150?u=narendra' }} 
            style={styles.avatar} 
          />
          <View style={styles.qrBadge}>
            <QrCode size={16} color="#fff" />
          </View>
        </View>
      </View>

      {/* Rewards Row */}
      <View style={styles.rewardsRow}>
        <TouchableOpacity style={[styles.rewardCard, { backgroundColor: '#3A2C4A' }]}>
          <Gift size={24} color="#D1B2FF" />
          <View style={styles.rewardTextContainer}>
            <Text style={styles.rewardTitle}>2 rewards</Text>
            <Text style={styles.rewardSubtitle}>View now</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.rewardCard, { backgroundColor: '#213B44' }]}>
          <Users size={24} color="#8CE1CD" />
          <View style={styles.rewardTextContainer}>
            <Text style={styles.rewardTitle}>Get ₹151</Text>
            <Text style={styles.rewardSubtitle}>Refer a friend</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Payment Methods */}
      <View style={styles.paymentMethodsContainer}>
        <View style={styles.paymentMethodsHeader}>
          <Text style={styles.paymentMethodsTitle}>Set up payment methods 1/3</Text>
          <ChevronRight size={20} color="#A0A0A0" />
        </View>

        <View style={styles.paymentMethodsList}>
          <TouchableOpacity style={styles.paymentMethodItem}>
            <View style={styles.paymentMethodIconWrapper}>
              <Landmark size={24} color="#A8C7FA" />
            </View>
            <Text style={styles.paymentMethodName}>Bank account</Text>
            <Text style={styles.paymentMethodDesc}>1 account</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.paymentMethodItem}>
            <View style={[styles.paymentMethodIconWrapper, styles.dashedBorder]}>
              <CreditCard size={24} color="#A8C7FA" />
              <View style={styles.addBadge}>
                <Text style={styles.addBadgeText}>+</Text>
              </View>
            </View>
            <Text style={styles.paymentMethodName}>RuPay credit card</Text>
            <Text style={styles.paymentMethodDesc}>Pay with UPI</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.paymentMethodItem}>
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

      {/* Menu List */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <QrCode size={24} color="#A8C7FA" style={styles.menuIcon} />
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>Your QR code</Text>
            <Text style={styles.menuSubtitle}>Use to receive money from any UPI app</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <RefreshCw size={24} color="#A8C7FA" style={styles.menuIcon} />
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>Autopay</Text>
            <Text style={styles.menuSubtitle}>No pending requests</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Heart size={24} color="#A8C7FA" style={styles.menuIcon} />
          <View style={styles.menuTextContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.menuTitle}>Set up pocket money</Text>
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>New</Text>
              </View>
            </View>
            <Text style={styles.menuSubtitle}>Let your loved ones pay using UPI Circle</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={logout}>
          <LogOut size={24} color="#EF4444" style={styles.menuIcon} />
          <View style={styles.menuTextContainer}>
            <Text style={[styles.menuTitle, { color: '#EF4444' }]}>Logout</Text>
            <Text style={styles.menuSubtitle}>Sign out of your account</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    backgroundColor: '#1E2822', // Dark greenish background mimicking the image
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '400',
    marginBottom: 20,
  },
  upiContainer: {
    marginBottom: 10,
  },
  upiText: {
    color: '#D0D0D0',
    fontSize: 15,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneText: {
    color: '#D0D0D0',
    fontSize: 15,
    marginRight: 12,
  },
  upiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A56D0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 6,
  },
  upiBadgeText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '500',
  },
  avatarContainer: {
    position: 'relative',
    marginTop: 10,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
  },
  qrBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#333',
    borderRadius: 16,
    padding: 6,
    borderWidth: 2,
    borderColor: '#1E2822',
  },
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
    borderRadius: 24,
    gap: 12,
  },
  rewardTextContainer: {
    flex: 1,
  },
  rewardTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  rewardSubtitle: {
    color: '#D0D0D0',
    fontSize: 13,
    marginTop: 2,
  },
  paymentMethodsContainer: {
    margin: 16,
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 20,
  },
  paymentMethodsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  paymentMethodsTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '500',
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
    borderColor: '#1E1E1E',
  },
  addBadgeText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  paymentMethodName: {
    color: '#FFF',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  paymentMethodDesc: {
    color: '#A0A0A0',
    fontSize: 12,
    textAlign: 'center',
  },
  menuContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
  },
  menuIcon: {
    marginRight: 18,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  menuSubtitle: {
    color: '#A0A0A0',
    fontSize: 13,
  },
  newBadge: {
    backgroundColor: '#A8C7FA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 8,
  },
  newBadgeText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '600',
  },
});

