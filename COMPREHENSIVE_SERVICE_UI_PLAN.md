# Comprehensive Service UI Implementation Plan

## Service Categories Analysis

Based on provider data, we have **11 main service categories** with 407 providers:

### 1. Mobile Recharge (service_id: 1) ✅ DONE
**Providers**: AIRTEL, VI, IDEA, BSNL
**Status**: Implemented
**Screen**: `/mobile-recharge`

### 2. DTH Recharge (service_id: 2) ✅ DONE
**Providers**: DISH TV, TATA SKY, SUN TV, VIDEOCON D2H TV, AIRTEL DIGITAL TV
**Status**: Implemented
**Screen**: `/dth-recharge`

### 3. Mobile Postpaid (service_id: 3) ❌ TODO
**Providers**: AIRTEL POSTPAID, IDEA POSTPAID, VI POSTPAID, RELIANCE GSM POSTPAID
**Screen**: `/mobile-postpaid`

### 4. Landline (service_id: 4) ❌ TODO
**Providers**: MTNL LANDLINE DELHI, BSNL Landline, AIRTEL LANDLINE
**Screen**: `/landline`

### 5. DMT - Domestic Money Transfer (service_id: 8) ❌ TODO
**Providers**: EKYC DMT SENDER
**Screen**: `/dmt`

### 6. Payout (service_id: 9) ❌ TODO
**Providers**: PAYOUT (NEFT), Bank Settlement (IMPS)
**Screen**: `/payout`

### 7. Auto Collect (service_id: 10) ❌ TODO
**Providers**: AUTO COLLECT (UPI)
**Screen**: `/auto-collect`

### 8. Verification (service_id: 11) ❌ TODO
**Providers**: Aadhaar Verification
**Screen**: `/verification`

### 9. Insurance (service_id: 23) ❌ TODO
**Providers**: InsuranceDekho
**Screen**: `/insurance`

### 10. Gift Card (service_id: 27) ❌ TODO
**Providers**: Google Play Gift Card
**Screen**: `/gift-card`

### 11. Payment Gateway (service_id: 29) ❌ TODO
**Providers**: NET BANKING, CREDIT CARD, DEBIT CARD, UPI, WALLET, EMI
**Screen**: `/payment-gateway`

---

## Detailed UI Implementation Plan

### Priority 1: Mobile Postpaid (service_id: 3)

**User Flow**:
1. Select operator (AIRTEL POSTPAID, IDEA POSTPAID, VI POSTPAID, RELIANCE GSM POSTPAID)
2. Enter mobile number (10 digits)
3. Fetch bill details (amount, due date, billing cycle)
4. Review bill summary
5. Make payment
6. Success confirmation with receipt

**UI Components**:
- OperatorSelector (reuse from recharge)
- MobileNumberInput (reuse from recharge)
- BillDetailsCard (new)
- PaymentSummary (new)
- SuccessScreen (reuse)

**Screen**: `app/(tabs)/mobile-postpaid.tsx`

---

### Priority 2: Landline (service_id: 4)

**User Flow**:
1. Select operator (MTNL LANDLINE DELHI, BSNL Landline, AIRTEL LANDLINE)
2. Enter landline number with STD code
3. Select circle/region
4. Fetch bill details
5. Review and pay
6. Success confirmation

**UI Components**:
- OperatorSelector (reuse)
- LandlineInput (new - with STD code)
- CircleSelector (new - dropdown)
- BillDetailsCard (reuse)
- PaymentSummary (reuse)

**Screen**: `app/(tabs)/landline.tsx`

---

### Priority 3: DMT - Domestic Money Transfer (service_id: 8)

**User Flow**:
1. Sender verification (Aadhaar/OTP)
2. Add beneficiary (bank details, IFSC)
3. Enter amount
4. Review transaction
5. Confirm and transfer
6. Success with transaction ID

**UI Components**:
- SenderVerificationForm (new)
- BeneficiaryForm (new)
- BankDetailsInput (new)
- AmountInput (reuse)
- TransactionSummary (new)
- SuccessScreen (reuse)

**Screen**: `app/(tabs)/dmt.tsx`

---

### Priority 4: Payout (service_id: 9)

**User Flow**:
1. Select payout method (NEFT, IMPS, RTGS)
2. Enter beneficiary details
3. Enter amount
4. Review transaction
5. Confirm payout
6. Success confirmation

**UI Components**:
- PayoutMethodSelector (new - cards with icons)
- BeneficiaryForm (reuse from DMT)
- AmountInput (reuse)
- TransactionSummary (reuse)
- SuccessScreen (reuse)

**Screen**: `app/(tabs)/payout.tsx`

---

### Priority 5: Auto Collect (service_id: 10)

**User Flow**:
1. Link UPI ID/VPA
2. Set up auto collection rules
3. Configure amount and frequency
4. Review setup
5. Activate
6. Success confirmation

**UI Components**:
- UPIInput (new)
- AutoCollectRules (new)
- FrequencySelector (new - daily, weekly, monthly)
- SetupSummary (new)
- SuccessScreen (reuse)

**Screen**: `app/(tabs)/auto-collect.tsx`

---

### Priority 6: Aadhaar Verification (service_id: 11)

**User Flow**:
1. Enter Aadhaar number (12 digits)
2. Select verification type (OTP/Biometric)
3. Enter OTP or scan fingerprint
4. Verification status
5. Success/Failure message

**UI Components**:
- AadhaarInput (new - 12 digits with validation)
- VerificationMethodSelector (new)
- OTPInput (new)
- BiometricScanner (new - if supported)
- VerificationStatus (new)
- SuccessScreen (reuse)

**Screen**: `app/(tabs)/verification.tsx`

---

### Priority 7: Insurance (service_id: 23)

**User Flow**:
1. Select insurance type (Bike, Car, Health, Life)
2. Enter vehicle/personal details
3. Get quotes
4. Compare plans
5. Select plan
6. Make payment
7. Policy issuance

**UI Components**:
- InsuranceTypeSelector (new - cards with icons)
- VehicleDetailsForm (new)
- PersonalDetailsForm (new)
- QuoteComparison (new - cards)
- PlanSelector (new)
- PaymentSummary (reuse)
- SuccessScreen (reuse)

**Screen**: `app/(tabs)/insurance.tsx`

---

### Priority 8: Gift Card (service_id: 27)

**User Flow**:
1. Select gift card type (Google Play, Amazon, etc.)
2. Enter recipient details
3. Select amount
4. Add message
5. Review order
6. Make payment
7. Gift card delivery

**UI Components**:
- GiftCardSelector (new - cards with brand logos)
- RecipientForm (new)
- AmountSelector (new - preset amounts + custom)
- MessageInput (new)
- OrderSummary (new)
- PaymentSummary (reuse)
- SuccessScreen (reuse)

**Screen**: `app/(tabs)/gift-card.tsx`

---

### Priority 9: Payment Gateway (service_id: 29)

**User Flow**:
1. Select payment method (Net Banking, Credit Card, Debit Card, UPI, Wallet)
2. Enter payment details
3. Process payment
4. Success/Failure status

**UI Components**:
- PaymentMethodSelector (new - cards with icons)
- CardDetailsForm (new)
- BankSelector (new)
- UPIInput (new)
- WalletSelector (new)
- ProcessingAnimation (new)
- SuccessScreen (reuse)

**Screen**: `app/(tabs)/payment-gateway.tsx`

---

## Shared Component Library

### New Components to Create:

**components/shared/**
1. `BillDetailsCard.tsx` - Display bill details (amount, due date, etc.)
2. `PaymentSummary.tsx` - Summary before payment
3. `TransactionSummary.tsx` - Transaction details summary
4. `SuccessScreen.tsx` - Success screen with receipt (already exists)
5. `LoadingOverlay.tsx` - Full-screen loading overlay
6. `ErrorScreen.tsx` - Error display with retry option
7. `OTPInput.tsx` - OTP input with auto-focus
8. `BankDetailsInput.tsx` - Bank account and IFSC input
9. `CircleSelector.tsx` - Region/circle dropdown
10. `FrequencySelector.tsx` - Frequency selection (daily, weekly, monthly)

**components/forms/**
1. `AadhaarInput.tsx` - Aadhaar number input with validation
2. `UPIInput.tsx` - UPI ID/VPA input
3. `LandlineInput.tsx` - Landline with STD code
4. `RecipientForm.tsx` - Gift card recipient form
5. `VehicleDetailsForm.tsx` - Vehicle details for insurance
6. `PersonalDetailsForm.tsx` - Personal details form

**components/selectors/**
1. `PaymentMethodSelector.tsx` - Payment method cards
2. `InsuranceTypeSelector.tsx` - Insurance type cards
3. `GiftCardSelector.tsx` - Gift card brand cards
4. `PayoutMethodSelector.tsx` - NEFT/IMPS/RTGS selector
5. `VerificationMethodSelector.tsx` - OTP/Biometric selector

---

## UI Design Principles

### Color Scheme:
- **Primary**: #00B9F2 (Blue)
- **Secondary**: #FFA585 (Orange)
- **Success**: #0F971C (Green)
- **Error**: #AE1B1E (Red)
- **Background**: #F8F5F0 (Light cream)
- **Card**: #FFFFFF (White)
- **Text**: #1A1A1A (Dark gray)

### Typography:
- **Headings**: Bold, 18-24px
- **Body**: Regular, 14-16px
- **Captions**: Medium, 12px
- **Numbers**: Semi-bold, 16-20px

### Spacing:
- **Padding**: 16px (cards), 24px (screens)
- **Gap**: 12px (items), 16px (sections)
- **Border Radius**: 12px (cards), 8px (buttons)

### Animations:
- **Fade in**: 300ms
- **Slide up**: 400ms
- **Scale**: 200ms
- **Loading**: Spinner with backdrop

---

## Implementation Order

### Phase 1: Core Components (2-3 hours)
1. Create shared components library
2. Create form components
3. Create selector components
4. Test components individually

### Phase 2: High Priority Services (4-5 hours)
1. Mobile Postpaid
2. Landline
3. DMT
4. Payout

### Phase 3: Medium Priority Services (3-4 hours)
1. Auto Collect
2. Aadhaar Verification
3. Insurance

### Phase 4: Low Priority Services (2-3 hours)
1. Gift Card
2. Payment Gateway

### Phase 5: Integration & Testing (2-3 hours)
1. Update HomePageConfiguration
2. Add routing configuration
3. Test all flows
4. Fix bugs and polish UI

**Total Estimated Time**: 13-18 hours

---

## Routing Configuration

Add to `app/(tabs)/_layout.tsx`:
```typescript
<Tabs.Screen name="mobile-postpaid" options={{ href: null, headerShown: false }} />
<Tabs.Screen name="landline" options={{ href: null, headerShown: false }} />
<Tabs.Screen name="dmt" options={{ href: null, headerShown: false }} />
<Tabs.Screen name="payout" options={{ href: null, headerShown: false }} />
<Tabs.Screen name="auto-collect" options={{ href: null, headerShown: false }} />
<Tabs.Screen name="verification" options={{ href: null, headerShown: false }} />
<Tabs.Screen name="insurance" options={{ href: null, headerShown: false }} />
<Tabs.Screen name="gift-card" options={{ href: null, headerShown: false }} />
<Tabs.Screen name="payment-gateway" options={{ href: null, headerShown: false }} />
```

---

## Asset Requirements

Create icons at `assets/icons/`:
- **postpaid/mobile.png**
- **landline/phone.png**
- **dmt/transfer.png**
- **payout/bank.png**
- **auto-collect/upi.png**
- **verification/aadhaar.png**
- **insurance/shield.png**
- **gift-card/gift.png**
- **payment/card.png**

---

## API Integration Notes

Each service will need:
1. Service-specific API endpoints
2. Provider filtering by service_id
3. Transaction processing
4. Status checking
5. Error handling

**API Service Structure**:
```typescript
// api/services.ts
export const servicesService = {
  getProviders: (serviceId: number) => Promise<Provider[]>,
  fetchBill: (data: BillFetchRequest) => Promise<BillDetails>,
  processPayment: (data: PaymentRequest) => Promise<PaymentResponse>,
  checkStatus: (transactionId: string) => Promise<StatusResponse>,
}
```

---

## Testing Checklist

For each service:
- [ ] Screen loads without errors
- [ ] Provider list displays correctly
- [ ] Input validation works
- [ ] API integration successful
- [ ] Payment processes correctly
- [ ] Success screen displays
- [ ] Error handling works
- [ ] Navigation flows properly
- [ ] UI is stunning and responsive
- [ ] Animations are smooth

---

## Next Steps

1. Start with Phase 1: Create shared component library
2. Move to Phase 2: Build high priority services
3. Continue with remaining phases
4. Final integration and testing

Would you like me to start implementing Phase 1 (Core Components) or begin with a specific service?
