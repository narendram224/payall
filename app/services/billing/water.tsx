import React from 'react';
import BBPSBillScreen from '@/components/bbps/BBPSBillScreen';

export default function WaterBill() {
  return (
    <BBPSBillScreen
      categorySlug="water-supply"
      serviceTitle="Water Bill"
      consumerLabel="Consumer Number"
      consumerPlaceholder="Enter your water consumer number"
      consumerKeyboardType="numeric"
      consumerMaxLength={20}
      quickAmounts={[100, 200, 500, 1000, 2000]}
    />
  );
}
