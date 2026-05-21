import { useEffect } from 'react';
import { router } from 'expo-router';

// DMT service now lives at /dmt — redirect there
export default function DMTRedirect() {
  useEffect(() => {
    router.replace('/dmt' as any);
  }, []);
  return null;
}
