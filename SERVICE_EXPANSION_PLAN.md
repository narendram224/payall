# Service Expansion Plan

## Analysis

### API Services with `display: 1` (Active & Displayed):
1. **Mobile** (id: 1) - ✅ Implemented
2. **DTH** (id: 2) - ✅ Implemented
3. **Bill Pay** (id: 31) - ❌ Missing

### Current HomePageConfiguration:
- **RechargeSection**: Mobile, DTH, Fastag
- **BillPaySection**: Electricity, Water, Gas, Broadband, Landline, LPG Gas, Cable TV, View All
- **FINANCESection**: Car Loan, EMI, Gold, Silver, Loan, Postpaid, View All
- **InsuranceSection**: Bike, Car, Health, All Insurance

## Missing Services to Implement

### Priority 1: Bill Pay (BBPS)
**Service ID**: 31
**Description**: BBPS (Bharat Bill Payment System)
**Icon**: Available from API
**Status**: ❌ Not implemented

**Required Features**:
- Biller selection based on service type (Electricity, Water, Gas, etc.)
- Consumer number/input validation
- Bill amount fetch
- Payment processing
- Transaction confirmation
- Receipt generation

### Priority 2: Electricity Bill Payment
**Service ID**: 5 (display: 0, but commonly used)
**Description**: Pay Electricity Bill
**Status**: ❌ Not implemented

### Priority 3: Water Bill Payment
**Service ID**: 6 (display: 0)
**Description**: Pay Water Bill
**Status**: ❌ Not implemented

### Priority 4: Gas Bill Payment
**Service ID**: 7 (display: 0)
**Description**: Pay Gas Bill
**Status**: ❌ Not implemented

## Implementation Plan

### Phase 1: Bill Pay Core Infrastructure
1. **Create API Service Layer** (`api/billPay.ts`)
   - Fetch billers by service type
   - Fetch bill details by consumer number
   - Process bill payment
   - Check transaction status

2. **Create Reusable Components** (`components/bill/`)
   - `BillerSelector` - Horizontal scrollable biller selection
   - `ConsumerInput` - Consumer number input with validation
   - `BillDetailsCard` - Display bill details (amount, due date, etc.)
   - `BillSummary` - Summary before payment
   - `PaymentSuccess` - Success screen with receipt

3. **Create Bill Pay Screen** (`app/(tabs)/bill-pay.tsx`)
   - Service type selection (Electricity, Water, Gas, etc.)
   - Biller selection
   - Consumer number input
   - Fetch bill details
   - Payment confirmation
   - Success screen

### Phase 2: Individual Bill Payment Screens
1. **Electricity Bill** (`app/(tabs)/bill-pay/electricity.tsx`)
2. **Water Bill** (`app/(tabs)/bill-pay/water.tsx`)
3. **Gas Bill** (`app/(tabs)/bill-pay/gas.tsx`)
4. **Broadband** (`app/(tabs)/bill-pay/broadband.tsx`)
5. **Landline** (`app/(tabs)/bill-pay/landline.tsx`)
6. **LPG Gas** (`app/(tabs)/bill-pay/lpg.tsx`)
7. **Cable TV** (`app/(tabs)/bill-pay/cable.tsx`)

### Phase 3: UI Enhancement
1. **Stunning UI Design**
   - Use gradient backgrounds
   - Smooth animations
   - Card-based layouts
   - Beautiful icons from API
   - Loading states
   - Error handling

2. **User Experience**
   - Quick bill fetch
   - Auto-fill for repeat payments
   - Bill reminders
   - Payment history
   - Favorite billers

## API Integration

### Bill Pay API Endpoints:
- `GET billers` - Fetch billers by service type
- `POST bill/fetch` - Fetch bill details
- `POST bill/pay` - Process payment
- `POST bill/status` - Check payment status

### Expected Response Structure:
```typescript
interface Biller {
  id: number;
  biller_name: string;
  service_id: number;
  icon: string;
  active: number;
}

interface BillDetails {
  biller_id: number;
  consumer_number: string;
  amount: number;
  due_date: string;
  bill_date: string;
  consumer_name: string;
}
```

## Routing Configuration
Add to `app/(tabs)/_layout.tsx`:
```typescript
<Tabs.Screen name="bill-pay" options={{ href: null, headerShown: false }} />
<Tabs.Screen name="bill-pay/electricity" options={{ href: null, headerShown: false }} />
<Tabs.Screen name="bill-pay/water" options={{ href: null, headerShown: false }} />
<Tabs.Screen name="bill-pay/gas" options={{ href: null, headerShown: false }} />
<Tabs.Screen name="bill-pay/broadband" options={{ href: null, headerShown: false }} />
<Tabs.Screen name="bill-pay/landline" options={{ href: null, headerShown: false }} />
<Tabs.Screen name="bill-pay/lpg" options={{ href: null, headerShown: false }} />
<Tabs.Screen name="bill-pay/cable" options={{ href: null, headerShown: false }} />
```

## Asset Requirements
Create icons at `assets/icons/bill/`:
- electricity.png
- water.png
- gas.png
- broadband.png
- landline.png
- lpg.png
- cable.png
- all.png

## Testing Checklist
- [ ] Bill Pay screen loads correctly
- [ ] Service type selection works
- [ ] Biller list loads from API
- [ ] Consumer number validation works
- [ ] Bill details fetch successfully
- [ ] Payment processes correctly
- [ ] Success screen displays properly
- [ ] Error handling works
- [ ] Navigation flows correctly
- [ ] Icons display correctly

## Timeline
- **Phase 1**: 2-3 hours (Core infrastructure)
- **Phase 2**: 4-5 hours (Individual screens)
- **Phase 3**: 2-3 hours (UI enhancement)
- **Testing**: 1-2 hours

**Total Estimated Time**: 9-13 hours
