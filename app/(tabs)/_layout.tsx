import { Tabs } from 'expo-router';
import { ClarifiedAir } from '../../constants/theme';
import { Map, List, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ClarifiedAir.colors.accent,
        tabBarInactiveTintColor: ClarifiedAir.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: ClarifiedAir.colors.surface,
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: ClarifiedAir.shadows.floating.shadowColor,
          shadowOffset: ClarifiedAir.shadows.floating.shadowOffset,
          shadowOpacity: ClarifiedAir.shadows.floating.shadowOpacity,
          shadowRadius: ClarifiedAir.shadows.floating.shadowRadius,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <Map color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color }) => <List color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
