import React from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, Alert, LayoutAnimation } from 'react-native';
import { useRouter } from 'expo-router';
import { Map, Moon, Database, Info, LogOut } from 'lucide-react-native';
import { AccordionItem } from './AccordionItem';
import { useSettingsStore } from '@/lib/store/useSettingsStore';
import * as Location from 'expo-location';

export const SettingsList = () => {
  const router = useRouter();
  const { isDarkMode: isDark, setDarkMode: toggleTheme, locationEnabled, setLocationEnabled, mapStyle, setMapStyle, clearImageCache } = useSettingsStore();

  const handleLocationToggle = async (value: boolean) => {
    if (value) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationEnabled(true);
      } else {
        Alert.alert('Permission Denied', 'Please enable location permissions in your device settings.');
        setLocationEnabled(false);
      }
    } else {
      setLocationEnabled(false);
    }
  };

  const handleMapStyleChange = (style: 'Standard' | 'Satellite' | 'Terrain') => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMapStyle(style);
  };

  const handleClearCache = () => {
    Alert.alert('Clear Cache', 'Are you sure you want to clear the image cache?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearImageCache }
    ]);
  };

  return (
    <View style={styles.container}>
      <AccordionItem title="Appearance" icon={Moon}>
        <View style={styles.row}>
          <Text style={[styles.label, isDark && styles.labelDark]}>Dark Mode</Text>
          <Switch 
            value={isDark} 
            onValueChange={toggleTheme}
            trackColor={{ false: isDark ? '#374151' : '#d1d5db', true: '#3b82f6' }}
            thumbColor={'#ffffff'}
          />
        </View>
      </AccordionItem>

      <AccordionItem title="Location & Map" icon={Map}>
        <View style={styles.row}>
          <Text style={[styles.label, isDark && styles.labelDark]}>Enable Location</Text>
          <Switch 
            value={locationEnabled} 
            onValueChange={handleLocationToggle}
            trackColor={{ false: isDark ? '#374151' : '#d1d5db', true: '#3b82f6' }}
            thumbColor={'#ffffff'}
          />
        </View>
        
        <View style={styles.divider} />
        
        <Text style={[styles.subTitle, isDark && styles.subTitleDark]}>Map Style</Text>
        <View style={[styles.segmentedControl, isDark && styles.segmentedControlDark]}>
          {['Standard', 'Satellite', 'Terrain'].map((style) => {
            const isSelected = mapStyle === style;
            return (
              <TouchableOpacity 
                key={style}
                style={[
                  styles.segment, 
                  isSelected && styles.segmentSelected,
                  isDark && isSelected && styles.segmentSelectedDark
                ]}
                onPress={() => handleMapStyleChange(style as any)}
              >
                <Text style={[
                  styles.segmentText, 
                  isSelected && styles.segmentTextSelected,
                  isDark && styles.segmentTextDark,
                  isDark && isSelected && styles.segmentTextSelectedDark
                ]}>
                  {style}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </AccordionItem>

      <AccordionItem title="Data & Storage" icon={Database}>
        <TouchableOpacity style={[styles.actionButton, isDark && styles.actionButtonDark]} onPress={handleClearCache}>
          <Text style={[styles.actionButtonText, isDark && styles.actionButtonTextDark]}>Clear Image Cache</Text>
        </TouchableOpacity>
      </AccordionItem>

      <AccordionItem title="About" icon={Info}>
        <View style={styles.aboutRow}>
          <Text style={[styles.label, isDark && styles.labelDark]}>Version</Text>
          <Text style={styles.valueText}>1.0.0</Text>
        </View>
        <TouchableOpacity style={styles.linkButton} onPress={() => router.push('/terms')}>
          <Text style={styles.linkText}>Terms of Service</Text>
        </TouchableOpacity>
      </AccordionItem>

      <TouchableOpacity style={[styles.logoutButton, isDark && styles.logoutButtonDark]}>
        <LogOut size={20} color={isDark ? '#fca5a5' : '#ef4444'} />
        <Text style={[styles.logoutText, isDark && styles.logoutTextDark]}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 16,
    color: '#374151',
  },
  labelDark: {
    color: '#d1d5db',
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 12,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 12,
  },
  subTitleDark: {
    color: '#9ca3af',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 4,
  },
  segmentedControlDark: {
    backgroundColor: '#1f2937',
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  segmentSelected: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  segmentSelectedDark: {
    backgroundColor: '#374151',
  },
  segmentText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  segmentTextDark: {
    color: '#9ca3af',
  },
  segmentTextSelected: {
    color: '#111827',
    fontWeight: '600',
  },
  segmentTextSelectedDark: {
    color: '#f9fafb',
  },
  actionButton: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  actionButtonDark: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  actionButtonText: {
    color: '#ef4444',
    fontWeight: '600',
    fontSize: 15,
  },
  actionButtonTextDark: {
    color: '#fca5a5',
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  valueText: {
    fontSize: 16,
    color: '#9ca3af',
  },
  linkButton: {
    paddingVertical: 12,
    marginTop: 4,
  },
  linkText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fee2e2',
    padding: 16,
    borderRadius: 16,
    marginTop: 24,
  },
  logoutButtonDark: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  logoutText: {
    color: '#ef4444',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  logoutTextDark: {
    color: '#fca5a5',
  },
});
