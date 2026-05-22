import React from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/text';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { router } from 'expo-router';
import { Shield, Car, HeartPulse, Star, CheckCircle2 } from 'lucide-react-native';

const PLANS = [
  {
    id: 'bike',
    icon: Shield,
    iconColor: '#a5b4fc',
    title: 'Bike Insurance',
    subtitle: 'Two-wheeler protection',
    route: '/services/insurance/bike',
    gradient: ['#1e1b4b', '#312e81'] as [string, string],
  },
  {
    id: 'car',
    icon: Car,
    iconColor: '#86efac',
    title: 'Car Insurance',
    subtitle: 'Four-wheeler coverage',
    route: '/services/insurance/car',
    gradient: ['#052e16', '#14532d'] as [string, string],
  },
  {
    id: 'health',
    icon: HeartPulse,
    iconColor: '#d8b4fe',
    title: 'Health Insurance',
    subtitle: 'Medical protection',
    route: '/services/insurance/health',
    gradient: ['#1c0626', '#3b0764'] as [string, string],
  },
  {
    id: 'life',
    icon: Star,
    iconColor: '#fcd34d',
    title: 'Life Insurance',
    subtitle: 'Family security',
    route: '/services/insurance/life',
    gradient: ['#0c0a00', '#451a03'] as [string, string],
  },
];

const WHY_BULLETS = [
  'Instant policy issuance',
  'Compare 20+ insurers',
  'Claims assistance 24/7',
  '100% paperless process',
  'Best price guarantee',
];

export default function InsuranceHub() {
  const reducedMotion = useReducedMotion();

  return (
    <View style={styles.root}>
      {/* Hero Header */}
      <LinearGradient
        colors={['#2d2d2d', '#1c1c1c']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}>
        <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(0).duration(400)}>
          <Text style={styles.heroTitle}>Insurance Services</Text>
          <Text style={styles.heroSubtitle}>Protect what matters most</Text>
        </Animated.View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* 2x2 Grid */}
        <View style={styles.grid}>
          {PLANS.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <Animated.View
                key={plan.id}
                entering={reducedMotion ? undefined : FadeInDown.delay(i * 90).duration(350)}
                style={styles.gridItem}>
                <Pressable
                  onPress={() => router.push(plan.route as any)}
                  style={({ pressed }) => [styles.cardPressable, { opacity: pressed ? 0.85 : 1 }]}>
                  <LinearGradient
                    colors={plan.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.card}>
                    <View style={styles.iconWrap}>
                      <Icon size={28} color={plan.iconColor} strokeWidth={1.8} />
                    </View>
                    <Text style={styles.cardTitle}>{plan.title}</Text>
                    <Text style={styles.cardSubtitle}>{plan.subtitle}</Text>
                  </LinearGradient>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        {/* Why section */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(420).duration(350)}
          style={styles.whyBox}>
          <Text style={styles.whyTitle}>Why insure with Pay2All?</Text>
          {WHY_BULLETS.map((bullet, i) => (
            <View key={i} style={styles.bulletRow}>
              <CheckCircle2 size={16} color="#6366f1" strokeWidth={2} />
              <Text style={styles.bulletText}>{bullet}</Text>
            </View>
          ))}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1c1c1c',
  },
  hero: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.2,
  },
  heroSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 48,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  gridItem: {
    width: '47.5%',
  },
  cardPressable: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  card: {
    padding: 20,
    borderRadius: 20,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  whyBox: {
    backgroundColor: '#2d2d2d',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  whyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 14,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  bulletText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    flex: 1,
  },
});
