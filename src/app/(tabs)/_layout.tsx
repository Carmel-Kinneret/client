import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, ActionSheetIOS, Alert } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Map, MessageSquare, User, Plus } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { useSettingsStore } from '@/lib/store/useSettingsStore';

function CustomTabBar({ state, descriptors, navigation }: any) {
  const BOTTOM_MARGIN = Platform.OS === 'ios' ? 32 : 24;
  const isDark = useSettingsStore((state) => state.isDarkMode);
  const router = useRouter();

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('שגיאה', 'יש לאשר גישה למצלמה כדי לצלם תמונות.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      router.push({ pathname: '/create-post', params: { imageUri: result.assets[0].uri } });
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      router.push({ pathname: '/create-post', params: { imageUri: result.assets[0].uri } });
    }
  };

  const handlePlusPress = () => {
    const options = ['צלם תמונה', 'בחר מהגלריה', 'ביטול'];
    const cancelButtonIndex = 2;

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options, cancelButtonIndex },
        (buttonIndex) => {
          if (buttonIndex === 0) takePhoto();
          else if (buttonIndex === 1) pickImage();
        }
      );
    } else {
      Alert.alert(
        'הוסף פוסט',
        'בחר מקור תמונה',
        [
          { text: 'צלם תמונה', onPress: takePhoto },
          { text: 'בחר מהגלריה', onPress: pickImage },
          { text: 'ביטול', style: 'cancel' },
        ]
      );
    }
  };

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
          onPress={handlePlusPress}
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
          title: 'מפה',
          tabBarIcon: ({ color, size }) => <Map color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="posts"
        options={{
          title: 'פוסטים',
          tabBarIcon: ({ color, size }) => <MessageSquare color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: 'אני',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
