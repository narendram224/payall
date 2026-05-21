import React from 'react';
import BBPSBillScreen from '@/components/bbps/BBPSBillScreen';

export default function GasBill() {
  return (
    <BBPSBillScreen
      categorySlug="natural-gas"
      serviceTitle="Gas Bill"
      consumerLabel="BP Number / CA Number"
      consumerPlaceholder="Enter your gas BP or CA number"
      consumerKeyboardType="default"
      consumerMaxLength={20}
      quickAmounts={[200, 500, 1000, 2000, 3000]}
    />
  );
}
