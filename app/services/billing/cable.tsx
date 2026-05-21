import React from 'react';
import BBPSBillScreen from '@/components/bbps/BBPSBillScreen';

export default function CableTVBill() {
  return (
    <BBPSBillScreen
      categorySlug="cable-tv"
      serviceTitle="Cable TV Bill"
      consumerLabel="Subscriber ID"
      consumerPlaceholder="Enter your cable TV subscriber ID"
      consumerKeyboardType="numeric"
      consumerMaxLength={20}
      quickAmounts={[199, 299, 399, 499, 699]}
    />
  );
}
