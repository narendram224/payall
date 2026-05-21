import { Stack } from 'expo-router';

export default function DMTLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Money Transfer',
          headerShown: true,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="add-sender"
        options={{
          title: 'Register Sender',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="verify-sender"
        options={{
          title: 'Verify Sender',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="beneficiaries"
        options={{
          title: 'Beneficiaries',
          headerShown: true,
        }}
      />
    </Stack>
  );
}
