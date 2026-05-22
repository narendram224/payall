import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Car, CheckCircle2, CreditCard, ArrowRight } from 'lucide-react-native';

const BENEFITS = [
  'Instant toll processing',
  'No queue at toll booths',
  'Auto recharge alerts',
  'Works on 500+ toll plazas',
];

const QUICK_AMOUNTS = [100, 200, 500, 1000];

const FastagRecharge = () => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();

  const handleQuickAmount = (value: number) => {
    setSelectedAmount(value);
    setAmount(String(value));
  };

  const handleAmountChange = (text: string) => {
    setSelectedAmount(null);
    setAmount(text);
  };

  const handleProceed = () => {
    if (!vehicleNumber.trim()) {
      Alert.alert('Error', 'Please enter your vehicle number');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    Alert.alert('Coming Soon', 'FASTag recharge via Pay2All is coming soon!');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <Animated.View
        entering={reducedMotion ? undefined : FadeInDown.duration(300).delay(0)}
        style={styles.heroSection}>
        <View style={styles.heroIconWrap}>
          <Car size={28} color="#6366f1" strokeWidth={2} />
        </View>
        <View style={styles.heroTextWrap}>
          <Text className="text-2xl font-bold tracking-tight text-gray-700">FASTag Recharge</Text>
          <Text className="mt-1 text-sm text-gray-400">
            Fast, cashless toll payments across India
          </Text>
        </View>
      </Animated.View>

      {/* Benefits Banner */}
      <Animated.View entering={reducedMotion ? undefined : FadeInDown.duration(300).delay(60)}>
        <View style={styles.benefitsBanner}>
          <Text className="text-lg font-semibold text-white">Why FASTag with Pay2All?</Text>
          <View style={styles.benefitsList}>
            {BENEFITS.map((benefit, index) => (
              <Animated.View
                key={benefit}
                entering={
                  reducedMotion ? undefined : FadeInDown.duration(300).delay(80 + index * 55)
                }
                style={styles.benefitRow}>
                <CheckCircle2 size={16} color="#10b981" strokeWidth={2.5} />
                <Text style={styles.benefitText}>{benefit}</Text>
              </Animated.View>
            ))}
          </View>
        </View>
      </Animated.View>

      {/* Form Card */}
      <Animated.View
        entering={reducedMotion ? undefined : FadeInDown.duration(300).delay(180)}
        style={styles.formCard}>
        {/* Vehicle Number Input */}
        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Car size={15} color="#9ca3af" strokeWidth={2} />
            <Text style={styles.inputLabel}>Vehicle Number</Text>
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="Enter vehicle number e.g. KA01AB1234"
            placeholderTextColor="#6b7280"
            value={vehicleNumber}
            onChangeText={(text) => setVehicleNumber(text.toUpperCase())}
            autoCapitalize="characters"
            keyboardType="default"
            returnKeyType="next"
          />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Amount Input */}
        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <CreditCard size={15} color="#9ca3af" strokeWidth={2} />
            <Text style={styles.inputLabel}>Recharge Amount</Text>
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="Enter amount"
            placeholderTextColor="#6b7280"
            value={amount}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
            returnKeyType="done"
          />
        </View>

        {/* Quick Amounts */}
        <View style={styles.quickAmountsRow}>
          {QUICK_AMOUNTS.map((value) => (
            <TouchableOpacity
              key={value}
              onPress={() => handleQuickAmount(value)}
              activeOpacity={0.75}
              style={[
                styles.quickAmountChip,
                selectedAmount === value && styles.quickAmountChipActive,
              ]}>
              <Text
                style={[
                  styles.quickAmountText,
                  selectedAmount === value && styles.quickAmountTextActive,
                ]}>
                ₹{value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Info Note */}
      <Animated.View
        entering={reducedMotion ? undefined : FadeInDown.duration(300).delay(240)}
        style={styles.infoNote}>
        <Text style={styles.infoText}>
          💡 FASTag is mandatory for all four-wheelers on national highways. Keep your FASTag
          balance topped up to avoid double toll charges.
        </Text>
      </Animated.View>

      {/* Proceed Button */}
      <Animated.View entering={reducedMotion ? undefined : FadeInDown.duration(300).delay(300)}>
        <TouchableOpacity
          onPress={handleProceed}
          activeOpacity={0.85}
          style={styles.proceedButtonWrapper}>
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.proceedButton}>
            <Text style={styles.proceedButtonText}>Proceed to Recharge</Text>
            <ArrowRight size={18} color="#ffffff" strokeWidth={2.5} />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 36,
    gap: 16,
  },

  /* Hero */
  heroSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 4,
  },
  heroIconWrap: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#312e81',
  },
  heroTextWrap: {
    flex: 1,
  },
  heroTitle: {
    color: '#f3f4f6',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  heroSubtitle: {
    color: '#9ca3af',
    fontSize: 13,
    marginTop: 2,
    fontWeight: '400',
  },

  /* Benefits Banner */
  benefitsBanner: {
    backgroundColor: '#1e1b4b',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#312e81',
  },
  benefitsTitle: {
    color: '#c7d2fe',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  benefitsList: {
    gap: 10,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  benefitText: {
    color: '#e0e7ff',
    fontSize: 13.5,
    fontWeight: '500',
    flex: 1,
  },

  /* Form Card */
  formCard: {
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: '#3f3f3f',
  },
  inputGroup: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  inputLabel: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  textInput: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#3f3f3f',
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: '#f3f4f6',
    fontSize: 15,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#3f3f3f',
    marginVertical: 18,
  },

  /* Quick Amounts */
  quickAmountsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    flexWrap: 'wrap',
  },
  quickAmountChip: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#3f3f3f',
  },
  quickAmountChipActive: {
    backgroundColor: '#312e81',
    borderColor: '#6366f1',
  },
  quickAmountText: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: '600',
  },
  quickAmountTextActive: {
    color: '#c7d2fe',
  },

  /* Info Note */
  infoNote: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#6366f1',
  },
  infoText: {
    color: '#9ca3af',
    fontSize: 12.5,
    lineHeight: 19,
    fontWeight: '400',
  },

  /* Proceed Button */
  proceedButtonWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  proceedButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    flexDirection: 'row',
    gap: 10,
  },
  proceedButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default FastagRecharge;
