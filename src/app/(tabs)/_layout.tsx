import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Map, MessageSquare, User, Plus } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useSettingsStore } from '@/lib/store/useSettingsStore';

function CustomTabBar({ state, descriptors, navigation }: any) {
  const BOTTOM_MARGIN = Platform.OS === 'ios' ? 32 : 24;
  const isDark = useSettingsStore((state) => state.isDarkMode);

  return (
    <View style={{
      position: 'absolute',
      bottom: BOTTOM_MARGIN,
      left: 24,
      right: 24,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      {/* Pill shape for Tabs */}
      <View style={{
        flex: 1,
        marginRight: 16,
        height: 64,
        borderRadius: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 20,
        elevation: 5,
      }}>
        <BlurView
          tint={isDark ? "dark" : "light"}
          intensity={isDark ? 50 : 80}
          style={{
            ...StyleSheet.absoluteFillObject,
            borderRadius: 32,
            overflow: 'hidden',
            backgroundColor: isDark ? 'rgba(31, 41, 55, 0.5)' : 'rgba(255, 255, 255, 0.4)',
          }}
        />
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                style={{ flex: 1, height: 64, alignItems: 'center', justifyContent: 'center' }}
              >
                {options.tabBarIcon({ 
                  focused: isFocused, 
                  color: isFocused ? (isDark ? '#ffffff' : '#000000') : '#9ca3af', 
                  size: 24 
                })}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Circle Plus Button */}
      <View style={{
        width: 64,
        height: 64,
        borderRadius: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 20,
        elevation: 5,
      }}>
        <BlurView
          tint={isDark ? "dark" : "light"}
          intensity={isDark ? 50 : 80}
          style={{
            ...StyleSheet.absoluteFillObject,
            borderRadius: 32,
            overflow: 'hidden',
            backgroundColor: isDark ? 'rgba(31, 41, 55, 0.5)' : 'rgba(255, 255, 255, 0.4)',
          }}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          onPress={() => console.log('Plus pressed')}
        >
          <Plus color={isDark ? '#ffffff' : '#000000'} size={28} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{ 
        headerShown: false,
        animation: 'shift',
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size }) => <Map color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="posts"
        options={{
          title: 'Posts',
          tabBarIcon: ({ color, size }) => <MessageSquare color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: 'Me',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
