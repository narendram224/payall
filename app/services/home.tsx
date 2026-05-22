import React, { useRef, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  FadeInDown,
  useReducedMotion,
} from 'react-native-reanimated';
import {
  Smartphone,
  Zap,
  Landmark,
  Shield,
  CheckCircle2,
  ChevronRight,
  Gift,
  Phone,
  ArrowRight,
  Star,
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    title: 'Recharge',
    subtitle: '4 services',
    gradient: ['#1e1b4b', '#312e81'] as const,
    Icon: Smartphone,
    route: '/services/recharge/mobile-recharge',
  },
  {
    title: 'Bill Payments',
    subtitle: 'BBPS powered',
    gradient: ['#052e16', '#14532d'] as const,
    Icon: Zap,
    route: '/services/billing/electricity-bill',
  },
  {
    title: 'Finance',
    subtitle: 'Loans & more',
    gradient: ['#1c1917', '#292524'] as const,
    Icon: Landmark,
    route: '/services/finance/loan',
  },
  {
    title: 'Insurance',
    subtitle: '4 categories',
    gradient: ['#1e0a29', '#3b0764'] as const,
    Icon: Shield,
    route: '/services/insurance/all',
  },
];

const WHY_POINTS = [
  'Instant recharge in under 5 seconds',
  '500+ operators & billers supported',
  '100% secure & encrypted transactions',
  'Cashback & rewards on every transaction',
  '24/7 customer support',
];

const OFFERS = [
  {
    badge: '₹50 Cashback',
    description: 'On your first mobile recharge',
    cta: 'Claim Now',
    gradient: ['#1e1b4b', '#312e81'] as const,
  },
  {
    badge: 'Win ₹500',
    description: 'Refer a friend & earn big rewards',
    cta: 'Refer Now',
    gradient: ['#052e16', '#14532d'] as const,
  },
  {
    badge: '5% Off',
    description: 'On your next electricity bill payment',
    cta: 'Pay Now',
    gradient: ['#4a1942', '#831843'] as const,
  },
];

const RECENT_RECHARGES = [
  {
    label: 'Jio Prepaid',
    amount: '₹299',
    number: '+91 98765 43210',
  },
  {
    label: 'BSNL',
    amount: '₹179',
    number: '+91 87654 32109',
  },
];

// ─── Floating Orb ────────────────────────────────────────────────────────────

interface OrbProps {
  color: string;
  size: number;
  top: number;
  left: number;
  delayMs: number;
  reducedMotion: boolean;
}

function FloatingOrb({ color, size, top, left, delayMs, reducedMotion }: OrbProps) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion) {
      opacity.value = 0.1;
      return;
    }
    opacity.value = withDelay(
      delayMs,
      withTiming(0.1, { duration: 800, easing: Easing.out(Easing.cubic) })
    );
    translateY.value = withDelay(
      delayMs,
      withRepeat(
        withSequence(
          withTiming(-18, { duration: 3200, easing: Easing.inOut(Easing.cubic) }),
          withTiming(18, { duration: 3200, easing: Easing.inOut(Easing.cubic) })
        ),
        -1,
        false
      )
    );
  }, [reducedMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.orb,
        animatedStyle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          top,
          left,
        },
      ]}
    />
  );
}

// ─── Category Card ────────────────────────────────────────────────────────────

interface CategoryCardProps {
  title: string;
  subtitle: string;
  gradient: readonly [string, string];
  Icon: React.ComponentType<{ size: number; color: string }>;
  route: string;
  index: number;
  reducedMotion: boolean;
}

function CategoryCard({
  title,
  subtitle,
  gradient,
  Icon,
  route,
  index,
  reducedMotion,
}: CategoryCardProps) {
  return (
    <Animated.View
      entering={
        reducedMotion
          ? undefined
          : FadeInDown.delay(index * 80)
              .duration(400)
              .easing(Easing.out(Easing.cubic))
      }
      style={styles.categoryCardWrapper}>
      <TouchableOpacity
        activeOpacity={0.82}
        onPress={() => router.push(route as any)}
        style={styles.categoryCardTouchable}>
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.categoryCardGradient}>
          {/* Glow accent in top-right */}
          <View style={styles.categoryGlowAccent} />
          <View style={styles.categoryIconWrapper}>
            <Icon size={26} color="#a5b4fc" />
          </View>
          <Text style={styles.categoryTitle}>{title}</Text>
          <Text style={styles.categorySubtitle}>{subtitle}</Text>
          <View style={styles.categoryArrow}>
            <ChevronRight size={14} color="#a5b4fc" />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Offer Card ───────────────────────────────────────────────────────────────

interface OfferCardProps {
  badge: string;
  description: string;
  cta: string;
  gradient: readonly [string, string];
  index: number;
  reducedMotion: boolean;
}

function OfferCard({ badge, description, cta, gradient, index, reducedMotion }: OfferCardProps) {
  return (
    <Animated.View
      entering={
        reducedMotion
          ? undefined
          : FadeInDown.delay(300 + index * 80)
              .duration(400)
              .easing(Easing.out(Easing.cubic))
      }>
      <TouchableOpacity activeOpacity={0.84} style={styles.offerCardTouchable}>
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.offerCard}>
          {/* Star badge */}
          <View style={styles.offerStarRow}>
            <Star size={12} color="#fbbf24" fill="#fbbf24" />
            <Text style={styles.offerStarText}>Limited Offer</Text>
          </View>
          <Text style={styles.offerBadge}>{badge}</Text>
          <Text style={styles.offerDescription}>{description}</Text>
          <View style={styles.offerCtaRow}>
            <Text style={styles.offerCta}>{cta}</Text>
            <ArrowRight size={13} color="#a5b4fc" />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ServicesHomeScreen() {
  const reducedMotion = useReducedMotion();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#1c1c1c" />

      {/* ── Floating Orbs ── */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <FloatingOrb
          color="#6366f1"
          size={260}
          top={-60}
          left={-80}
          delayMs={0}
          reducedMotion={!!reducedMotion}
        />
        <FloatingOrb
          color="#8b5cf6"
          size={200}
          top={200}
          left={SCREEN_WIDTH - 140}
          delayMs={400}
          reducedMotion={!!reducedMotion}
        />
        <FloatingOrb
          color="#a78bfa"
          size={300}
          top={560}
          left={-100}
          delayMs={200}
          reducedMotion={!!reducedMotion}
        />
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* ── Hero Header ── */}
          <Animated.View
            entering={
              reducedMotion
                ? undefined
                : FadeInDown.delay(0).duration(500).easing(Easing.out(Easing.cubic))
            }
            style={styles.heroSection}>
            <View style={styles.heroBadge}>
              <Star size={12} color="#a5b4fc" fill="#a5b4fc" />
              <Text style={styles.heroBadgeText}>Services Hub</Text>
            </View>
            <Text style={styles.heroTitle}>All Services</Text>
            <Text style={styles.heroSubtitle}>Pay bills, recharge, and more</Text>
          </Animated.View>

          {/* ── 2x2 Category Grid ── */}
          <Animated.View
            entering={
              reducedMotion
                ? undefined
                : FadeInDown.delay(60).duration(400).easing(Easing.out(Easing.cubic))
            }>
            <Text style={styles.sectionLabel}>Categories</Text>
          </Animated.View>

          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat, idx) => (
              <CategoryCard
                key={cat.title}
                title={cat.title}
                subtitle={cat.subtitle}
                gradient={cat.gradient}
                Icon={cat.Icon}
                route={cat.route}
                index={idx}
                reducedMotion={!!reducedMotion}
              />
            ))}
          </View>

          {/* ── Offers Carousel ── */}
          <Animated.View
            entering={
              reducedMotion
                ? undefined
                : FadeInDown.delay(200).duration(400).easing(Easing.out(Easing.cubic))
            }>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionLabel}>Exclusive Offers</Text>
              <TouchableOpacity>
                <Text style={styles.sectionViewAll}>View All</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.offersScrollContent}>
            {OFFERS.map((offer, idx) => (
              <OfferCard
                key={offer.badge}
                badge={offer.badge}
                description={offer.description}
                cta={offer.cta}
                gradient={offer.gradient}
                index={idx}
                reducedMotion={!!reducedMotion}
              />
            ))}
          </ScrollView>

          {/* ── Why Pay2All ── */}
          <Animated.View
            entering={
              reducedMotion
                ? undefined
                : FadeInDown.delay(320).duration(400).easing(Easing.out(Easing.cubic))
            }
            style={styles.whySection}>
            <Text style={styles.sectionLabel}>Why Pay2All?</Text>
            <LinearGradient
              colors={['#1e1b4b', '#1a1a2e']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.whyCard}>
              {/* Decorative line accent */}
              <View style={styles.whyAccentLine} />
              {WHY_POINTS.map((point, idx) => (
                <Animated.View
                  key={point}
                  entering={
                    reducedMotion
                      ? undefined
                      : FadeInDown.delay(360 + idx * 60)
                          .duration(350)
                          .easing(Easing.out(Easing.cubic))
                  }
                  style={styles.whyRow}>
                  <CheckCircle2 size={18} color="#6366f1" />
                  <Text style={styles.whyText}>{point}</Text>
                </Animated.View>
              ))}
            </LinearGradient>
          </Animated.View>

          {/* ── Recent Recharges ── */}
          <Animated.View
            entering={
              reducedMotion
                ? undefined
                : FadeInDown.delay(500).duration(400).easing(Easing.out(Easing.cubic))
            }>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionLabel}>Recent Recharges</Text>
              <TouchableOpacity>
                <Text style={styles.sectionViewAll}>See All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.recentCard}>
              {RECENT_RECHARGES.map((item, idx) => (
                <View
                  key={item.label}
                  style={[
                    styles.recentRow,
                    idx < RECENT_RECHARGES.length - 1 && styles.recentRowBorder,
                  ]}>
                  <View style={styles.recentIconWrapper}>
                    <Smartphone size={18} color="#6366f1" />
                  </View>
                  <View style={styles.recentInfo}>
                    <Text style={styles.recentLabel}>{item.label}</Text>
                    <Text style={styles.recentNumber}>{item.number}</Text>
                  </View>
                  <View style={styles.recentRight}>
                    <Text style={styles.recentAmount}>{item.amount}</Text>
                    <TouchableOpacity
                      style={styles.rechargeAgainBtn}
                      activeOpacity={0.78}
                      onPress={() => router.push('/services/recharge/mobile-recharge' as any)}>
                      <Text style={styles.rechargeAgainText}>Recharge Again</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* ── Recharge a Contact CTA ── */}
          <Animated.View
            entering={
              reducedMotion
                ? undefined
                : FadeInDown.delay(580).duration(400).easing(Easing.out(Easing.cubic))
            }
            style={styles.contactCtaWrapper}>
            <TouchableOpacity
              activeOpacity={0.84}
              onPress={() => router.push('/services/recharge/mobile-recharge' as any)}>
              <LinearGradient
                colors={['#4f46e5', '#7c3aed']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.contactCtaGradient}>
                <View style={styles.contactCtaIconWrapper}>
                  <Phone size={20} color="#fff" />
                </View>
                <Text style={styles.contactCtaText}>Recharge a Contact</Text>
                <ArrowRight size={18} color="#c7d2fe" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Bottom padding */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const CARD_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - 32 - CARD_GAP) / 2;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1c1c1c',
  },
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  // ── Orbs
  orb: {
    position: 'absolute',
  },

  // ── Hero
  heroSection: {
    paddingTop: 12,
    paddingBottom: 24,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(99,102,241,0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.3)',
    marginBottom: 12,
  },
  heroBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#a5b4fc',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#f1f5f9',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#94a3b8',
    fontWeight: '400',
  },

  // ── Section labels
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 12,
    marginTop: 4,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 4,
  },
  sectionViewAll: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366f1',
  },

  // ── Category Grid
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
    marginBottom: 28,
  },
  categoryCardWrapper: {
    width: CARD_WIDTH,
  },
  categoryCardTouchable: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  categoryCardGradient: {
    width: '100%',
    height: 148,
    padding: 16,
    borderRadius: 20,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    overflow: 'hidden',
  },
  categoryGlowAccent: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(165,180,252,0.08)',
  },
  categoryIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(165,180,252,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(165,180,252,0.2)',
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#e0e7ff',
    marginTop: 10,
  },
  categorySubtitle: {
    fontSize: 12,
    color: '#a5b4fc',
    fontWeight: '500',
    marginTop: 2,
  },
  categoryArrow: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(165,180,252,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Offers Carousel
  offersScrollContent: {
    paddingRight: 16,
    gap: 12,
    marginBottom: 28,
  },
  offerCardTouchable: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  offerCard: {
    width: SCREEN_WIDTH * 0.62,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    gap: 6,
  },
  offerStarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  offerStarText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fbbf24',
    letterSpacing: 0.3,
  },
  offerBadge: {
    fontSize: 26,
    fontWeight: '800',
    color: '#f1f5f9',
    letterSpacing: -0.5,
  },
  offerDescription: {
    fontSize: 13,
    color: '#a5b4fc',
    fontWeight: '400',
    lineHeight: 18,
  },
  offerCtaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  offerCta: {
    fontSize: 13,
    fontWeight: '700',
    color: '#a5b4fc',
    letterSpacing: 0.2,
  },

  // ── Why Pay2All
  whySection: {
    marginBottom: 28,
  },
  whyCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.2)',
    overflow: 'hidden',
    gap: 14,
  },
  whyAccentLine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: '#6366f1',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  whyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingLeft: 8,
  },
  whyText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#cbd5e1',
    flex: 1,
    lineHeight: 20,
  },

  // ── Recent Recharges
  recentCard: {
    backgroundColor: '#242424',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    marginBottom: 28,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  recentRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  recentIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: 'rgba(99,102,241,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.25)',
  },
  recentInfo: {
    flex: 1,
    gap: 3,
  },
  recentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  recentNumber: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '400',
  },
  recentRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  recentAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  rechargeAgainBtn: {
    backgroundColor: 'rgba(99,102,241,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.3)',
  },
  rechargeAgainText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#818cf8',
  },

  // ── Recharge a Contact CTA
  contactCtaWrapper: {
    marginBottom: 12,
    borderRadius: 18,
    overflow: 'hidden',
  },
  contactCtaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 14,
    borderRadius: 18,
  },
  contactCtaIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactCtaText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#f1f5f9',
    letterSpacing: 0.1,
  },

  // ── Bottom
  bottomSpacer: {
    height: 32,
  },
});
