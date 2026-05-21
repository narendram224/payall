import React from 'react';
import BBPSBillScreen from '@/components/bbps/BBPSBillScreen';

export default function LPGGasBill() {
  return (
    <BBPSBillScreen
      categorySlug="lpg-gas"
      serviceTitle="LPG Gas"
      consumerLabel="Consumer Number / LPG ID"
      consumerPlaceholder="Enter your LPG consumer number"
      consumerKeyboardType="numeric"
      consumerMaxLength={17}
      quickAmounts={[400, 600, 800, 1000, 1200]}
    />
  );
}
