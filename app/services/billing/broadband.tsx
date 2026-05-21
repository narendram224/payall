import React from 'react';
import BBPSBillScreen from '@/components/bbps/BBPSBillScreen';

export default function BroadbandBill() {
  return (
    <BBPSBillScreen
      categorySlug="broadband-postpaid"
      serviceTitle="Broadband Bill"
      consumerLabel="Account ID / User ID"
      consumerPlaceholder="Enter your broadband account ID"
      consumerKeyboardType="default"
      consumerMaxLength={30}
      quickAmounts={[299, 499, 699, 999, 1499]}
    />
  );
}
