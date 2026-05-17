import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, Pressable } from 'react-native';
import { router } from 'expo-router';
import GiftCardSelector from '@/components/selectors/GiftCardSelector';
import RecipientForm from '@/components/forms/RecipientForm';
import TransactionSummary from '@/components/shared/TransactionSummary';
import SuccessScreen from '@/components/recharge/SuccessScreen';
import LoadingOverlay from '@/components/shared/LoadingOverlay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const GiftCard = () => {
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [transactionResult, setTransactionResult] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const giftCards = [
    {
      id: '1',
      name: 'Google Play Gift Card',
      brand: 'Google Play',
      icon: '',
      minAmount: 100,
      maxAmount: 10000,
    },
    {
      id: '2',
      name: 'Amazon Gift Card',
      brand: 'Amazon',
      icon: '',
      minAmount: 100,
      maxAmount: 10000,
    },
    {
      id: '3',
      name: 'Netflix Gift Card',
      brand: 'Netflix',
      icon: '',
      minAmount: 500,
      maxAmount: 5000,
    },
  ];

  const presetAmounts = [100, 200, 500, 1000, 2000, 5000];

  const handleProceed = () => {
    if (!selectedCard) {
      Alert.alert('Error', 'Please select a gift card');
      return;
    }
    if (!recipientName || recipientName.length < 3) {
      Alert.alert('Error', 'Please enter recipient name');
      return;
    }
    if (!amount || parseFloat(amount) < selectedCard.minAmount) {
      Alert.alert(`Error`, `Minimum amount is ₹${selectedCard.minAmount}`);
      return;
    }

    setShowSummary(true);
  };

  const handlePurchase = async () => {
    try {
      setLoading(true);
      // TODO: Call API to purchase gift card
      // const result = await giftCardService.purchase({
      //   card_id: selectedCard.id,
      //   recipient_name: recipientName,
      //   recipient_email: recipientEmail,
      //   recipient_phone: recipientPhone,
      //   amount: parseFloat(amount),
      //   message,
      // });

      setTransactionResult({
        orderId: 'GC' + Date.now(),
        amount: amount,
        status: 'success',
      });
      setShowSuccess(true);
    } catch (error) {
      console.error('Error purchasing gift card:', error);
      Alert.alert('Error', 'Gift card purchase failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setShowSummary(false);
  };

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    setSelectedCard(null);
    setRecipientName('');
    setRecipientEmail('');
    setRecipientPhone('');
    setMessage('');
    setAmount('');
    router.back();
  };

  if (showSuccess) {
    return (
      <SuccessScreen
        orderId={transactionResult?.orderId}
        amount={transactionResult?.amount}
        message="Your gift card purchase was successful"
        onDone={handleSuccessComplete}
      />
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <Text className="mb-6 text-2xl font-bold text-gray-800">Gift Card</Text>

        <GiftCardSelector
          cards={giftCards}
          selectedCard={selectedCard}
          onSelectCard={setSelectedCard}
          className="mb-4"
        />

        <RecipientForm
          recipientName={recipientName}
          setRecipientName={setRecipientName}
          recipientEmail={recipientEmail}
          setRecipientEmail={setRecipientEmail}
          recipientPhone={recipientPhone}
          setRecipientPhone={setRecipientPhone}
          message={message}
          setMessage={setMessage}
          showEmail={true}
          showPhone={true}
          showMessage={true}
          className="mb-4"
        />

        <View className="mb-4">
          <Text className="mb-2 text-sm font-medium text-gray-700">Amount (₹)</Text>
          <Input
            placeholder="Enter amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            className="h-14 text-center text-xl font-bold"
          />
          <View className="mt-4 flex-row flex-wrap gap-2">
            {presetAmounts.map((preset) => (
              <Pressable
                key={preset}
                onPress={() => setAmount(preset.toString())}
                className={cn(
                  'min-w-[70px] items-center justify-center rounded-lg border-2 px-4 py-2',
                  amount === preset.toString()
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card'
                )}>
                <Text className="text-sm font-semibold">₹{preset}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {!showSummary && (
          <Button onPress={handleProceed} className="mt-4">
            <Text className="font-semibold text-white">Proceed</Text>
          </Button>
        )}

        {showSummary && (
          <>
            <TransactionSummary
              transactionType="Gift Card Purchase"
              recipientName={recipientName}
              accountNumber={recipientPhone || 'N/A'}
              bankName={selectedCard?.brand}
              amount={parseFloat(amount) || 0}
              className="mb-4"
            />

            <View className="mt-4 flex-row gap-3">
              <Button onPress={handleBack} variant="outline" className="flex-1">
                <Text className="font-semibold">Back</Text>
              </Button>
              <Button onPress={handlePurchase} className="flex-1">
                <Text className="font-semibold text-white">Purchase</Text>
              </Button>
            </View>
          </>
        )}
      </View>

      <LoadingOverlay visible={loading} message="Processing..." />
    </ScrollView>
  );
};

export default GiftCard;
