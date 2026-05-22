// components/recharge/ContactSelectorList.tsx
import React, { useState, useMemo } from 'react';
import { View, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { FlashList } from '@shopify/flash-list';
import { Search, RefreshCw, Users, ShieldAlert, Check } from 'lucide-react-native';
import * as Contacts from 'expo-contacts';

interface CleanContact {
  id: string;
  name: string;
  phoneNumber: string;
  initials: string;
}

interface ContactSelectorListProps {
  contacts: CleanContact[];
  permissionStatus: Contacts.PermissionStatus | null;
  isLoading: boolean;
  refetchContacts: () => void;
  mobileNumber: string;
  onSelectContact: (number: string) => void;
  listHeader: React.ComponentType<any> | React.ReactElement | null;
  listFooter: React.ComponentType<any> | React.ReactElement | null;
}

export default function ContactSelectorList({
  contacts,
  permissionStatus,
  isLoading,
  refetchContacts,
  mobileNumber,
  onSelectContact,
  listHeader,
  listFooter,
}: ContactSelectorListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = useMemo(() => {
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phoneNumber.includes(searchQuery)
    );
  }, [contacts, searchQuery]);

  // Render the sticky search bar at index 0 of the scrollable tree
  const renderSearchBox = () => (
    <View className="bg-slate-50 pb-3 pt-2">
      <View className="mb-3 flex-row items-center justify-between gap-2 px-1">
        <View className="flex-row items-center gap-2">
          <Search size={14} color="#64748b" strokeWidth={2.5} />
          <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Quick Contacts Directory
          </Text>
        </View>
        <Pressable
          onPress={refetchContacts}
          className="flex-row items-center gap-1 active:opacity-60">
          <RefreshCw
            size={10}
            color="#4f46e5"
            strokeWidth={3}
            className={isLoading ? 'animate-spin' : ''}
          />
          <Text className="text-[10px] font-bold text-indigo-600">Sync Contacts</Text>
        </Pressable>
      </View>

      <View className="flex-row items-center gap-3 rounded-2xl border border-slate-200/60 bg-white px-4 py-3 shadow-sm shadow-slate-100/50">
        <Search size={16} color="#94a3b8" strokeWidth={2.5} />
        <TextInput
          placeholder="Search contact index by name or line..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="flex-1 text-sm font-semibold text-slate-800"
        />
      </View>
    </View>
  );

  // Combine your main carrier layout forms with our search component
  const combinedHeader = () => (
    <View>
      {React.isValidElement(listHeader) ? listHeader : null}
      {renderSearchBox()}
    </View>
  );

  return (
    <View className="mx-auto w-full max-w-md flex-1">
      <FlashList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={combinedHeader}
        ListFooterComponent={listFooter}
        stickyHeaderIndices={[0]} // 🌟 Makes the search bar stick to the top on scroll
        ListEmptyComponent={
          permissionStatus === Contacts.PermissionStatus.DENIED ? (
            <View className="mt-2 items-center rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm">
              <View className="mb-2 rounded-full bg-rose-50 p-3">
                <ShieldAlert size={20} color="#f43f5e" />
              </View>
              <Text className="text-center text-xs font-bold text-rose-500">
                Contacts Access Restrained
              </Text>
              <Text className="mt-1 text-center text-[11px] text-slate-400">
                Please authorize access permissions via device settings to display contacts.
              </Text>
            </View>
          ) : isLoading ? (
            <View className="items-center justify-center py-8">
              <ActivityIndicator size="small" color="#4f46e5" />
            </View>
          ) : (
            <View className="mt-2 items-center rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm">
              <Users size={24} color="#cbd5e1" />
              <Text className="mt-2 text-xs font-bold text-slate-400">
                No matching phonebook record located
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => {
          const isSelected = mobileNumber === item.phoneNumber;
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
                <View className="h-5 w-5 items-center justify-center rounded-full bg-indigo-600">
                  <Check size={10} color="white" strokeWidth={3} />
                </View>
              )}
            </Pressable>
          );
        }}
      />
    </View>
  );
}
