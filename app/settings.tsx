import { Stack } from 'expo-router';
import { SettingsScreen } from '@/src/settings/screens/SettingsScreen';

export default function SettingsRoute() {
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Einstellungen',
        headerShown: true 
      }} />
      <SettingsScreen />
    </>
  );
}