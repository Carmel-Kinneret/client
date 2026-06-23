import '../global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryProvider } from '@/providers/QueryProvider';
import { I18nManager } from 'react-native';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryProvider>
        <SafeAreaProvider>
          <Stack screenOptions={{ 
            gestureEnabled: true, 
            fullScreenGestureEnabled: true,
          }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="settings" options={{ headerShown: false, presentation: 'modal' }} />
            <Stack.Screen name="terms" options={{ headerShown: false, presentation: 'modal' }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
        </SafeAreaProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}
