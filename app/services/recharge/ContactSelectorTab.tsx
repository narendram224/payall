// components/recharge/ContactSelectorTab.tsx
import React, { useState, useMemo } from 'react';
import { View, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { FlashList } from '@shopify/flash-list';
import { useDeviceContacts, CleanContact } from '@/hooks/useDeviceContacts';
import { Search, RefreshCw, Users, ShieldAlert, Check } from 'lucide-react-native';
import * as Contacts from 'expo-contacts';

interface ContactSelectorTabProps {
  onSelectContact: (number: string) => void;
  selectedNumber?: string;
}

export default function ContactSelectorTab({
  onSelectContact,
  selectedNumber,
}: ContactSelectorTabProps) {
  const { contacts, permissionStatus, isLoading, refetchContacts } = useDeviceContacts();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = useMemo(() => {
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phoneNumber.includes(searchQuery)
    );
  }, [contacts, searchQuery]);

  console.log('Filter', filteredContacts);

  // Handle Scenario A: Permissions Denied
  if (permissionStatus === Contacts.PermissionStatus.DENIED) {
    return (
      <View className="mt-4 items-center justify-center rounded-3xl border border-slate-200/60 bg-white p-8 shadow-sm">
        <View className="mb-3 rounded-full bg-rose-50 p-4">
          <ShieldAlert size={32} color="#f43f5e" />
        </View>
        <Text className="text-center text-base font-extrabold text-slate-800">
          Contacts Access Restrained
        </Text>
        <Text className="mt-1 max-w-[240px] text-center text-xs font-semibold text-slate-400">
          Please enable contacts sync permissions in your operating system device settings to pull
          your list.
        </Text>
        <Pressable
          onPress={refetchContacts}
          className="mt-5 rounded-xl bg-indigo-600 px-6 py-3 active:opacity-90">
          <Text className="text-xs font-bold text-white">Request Authorization</Text>
        </Pressable>
      </View>
    );
  }

  // Handle Scenario B: Loading State
  if (isLoading && contacts.length === 0) {
    return (
      <View className="items-center justify-center py-12">
        <ActivityIndicator size="small" color="#4f46e5" />
        <Text className="mt-3 text-xs font-bold uppercase tracking-widest text-slate-400">
          Hydrating Address Directives…
        </Text>
      </View>
    );
  }

  return (
    <View className="mt-4 flex-1">
      {/* Search Header and Manual Sync Layout Panel */}
      <View className="mb-4 flex-row items-center gap-3">
        <View className="flex-1 flex-row items-center gap-3 rounded-2xl border border-slate-200/60 bg-white px-4 py-3 shadow-sm shadow-slate-100/50">
          <Search size={16} color="#94a3b8" strokeWidth={2.5} />
          <TextInput
            placeholder="Search contacts name or number..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 text-sm font-semibold text-slate-800"
          />
        </View>
        <Pressable
          onPress={refetchContacts}
          disabled={isLoading}
          className="h-12 w-12 items-center justify-center rounded-2xl border border-slate-200/60 bg-white shadow-sm active:bg-slate-50">
          <RefreshCw
            size={16}
            color="#4f46e5"
            strokeWidth={2.5}
            className={isLoading ? 'animate-spin' : ''}
          />
        </Pressable>
      </View>

      {/* Main Vector List Engine */}
      <View className="min-h-[300px] flex-1">
        <FlashList
          data={filteredContacts}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="mt-4 items-center rounded-3xl border border-slate-200/60 bg-white p-8 shadow-sm">
              <Users size={32} color="#cbd5e1" />
              <Text className="mt-2 text-sm font-bold text-slate-400">
                No matching nodes located
              </Text>
            </View>
          }
          renderItem={({ item, index }) => {
            const isSelected = selectedNumber === item.phoneNumber;
            return (
              <Pressable
                onPress={() => onSelectContact(item.phoneNumber)}
                className={`mb-2 flex-row items-center rounded-2xl border p-3.5 transition-all active:scale-[0.99] ${
                  isSelected ? 'border-indigo-200 bg-indigo-50/70' : 'border-slate-200/60 bg-white'
                }`}>
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl border border-slate-200/40 bg-slate-100">
                  <Text className="text-xs font-black text-slate-600">{item.initials}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-extrabold tracking-tight text-slate-800">
                    {item.name}
                  </Text>
                  <Text className="mt-0.5 text-xs font-semibold text-slate-400">
                    +91 {item.phoneNumber}
                  </Text>
                </View>
                {isSelected && (
                  <View className="h-6 w-6 items-center justify-center rounded-full bg-indigo-600">
                    <Check size={12} color="white" strokeWidth={3} />
                  </View>
                )}
              </Pressable>
            );
          }}
        />
      </View>
    </View>
  );
}
