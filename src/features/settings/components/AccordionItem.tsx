import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, UIManager, Platform } from 'react-native';
import { ChevronDown, LucideIcon } from 'lucide-react-native';
import { useSettingsStore } from '@/lib/store/useSettingsStore';
import Animated, { useAnimatedStyle, withSpring, withTiming, useDerivedValue } from 'react-native-reanimated';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionItemProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export const AccordionItem = ({ title, icon: Icon, children }: AccordionItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const isDark = useSettingsStore((state) => state.isDarkMode);
  
  const progress = useDerivedValue(() => 
    expanded ? withSpring(1, { damping: 15, stiffness: 120 }) : withSpring(0, { damping: 15, stiffness: 120 })
  );

  const toggleAccordion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 180}deg` }]
  }));

  const contentStyle = useAnimatedStyle(() => {
    return {
      opacity: expanded ? withTiming(1, { duration: 250 }) : withTiming(0, { duration: 200 }),
    };
  });

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <TouchableOpacity 
        style={styles.header} 
        onPress={toggleAccordion}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <Icon size={20} color={isDark ? '#9ca3af' : '#4b5563'} />
          <Text style={[styles.title, isDark && styles.titleDark]}>{title}</Text>
        </View>
        <Animated.View style={chevronStyle}>
          <ChevronDown size={20} color={isDark ? '#9ca3af' : '#4b5563'} />
        </Animated.View>
      </TouchableOpacity>
      
      {expanded && (
        <Animated.View style={[styles.content, contentStyle]}>
          {children}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  containerDark: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  iconContainerDark: {
    backgroundColor: '#374151',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    textAlign: 'right',
    marginRight: 12,
  },
  titleDark: {
    color: '#f9fafb',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 4,
  },
});
