// hooks/useDeviceContacts.ts
import { useState, useEffect, useCallback } from 'react';
import * as Contacts from 'expo-contacts';

export interface CleanContact {
  id: string;
  name: string;
  phoneNumber: string;
  initials: string;
}

export function useDeviceContacts() {
  const [contacts, setContacts] = useState<CleanContact[]>([]);
  const [permissionStatus, setPermissionStatus] = useState<Contacts.PermissionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchContacts = useCallback(async () => {
    setIsLoading(true);
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      setPermissionStatus(status);

      if (status === Contacts.PermissionStatus.GRANTED) {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          const processed = data
            .filter(c => c.phoneNumbers && c.phoneNumbers.length > 0)
            .map(c => {
              // Rule: Strip formatting, pick the first available number, remove spaces/+91 prefix
              const rawNumber = c.phoneNumbers![0].number ?? '';
              const cleanNumber = rawNumber.replace(/\D/g, '').slice(-10);

              const initials = c.name
                .split(' ')
                .map(n => n.charAt(0))
                .join('')
                .toUpperCase()
                .slice(0, 2);

              return {
                id: c.id ?? Math.random().toString(),
                name: c.name,
                phoneNumber: cleanNumber,
                initials: initials || '👤',
              };
            })
            // Filter out any contacts that didn't result in a valid 10-digit number
            .filter(c => c.phoneNumber.length === 10)
            .sort((a, b) => a.name.localeCompare(b.name));

          setContacts(processed);
        }
      }
    } catch (error) {
      console.error('Error compiling device contacts directory:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return {
    contacts,
    permissionStatus,
    isLoading,
    refetchContacts: fetchContacts,
  };
}