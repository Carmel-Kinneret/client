import React, { useState, useRef, ReactNode } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, LayoutAnimation, UIManager, Platform } from 'react-native';
import { ChevronDown, LucideIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionItemProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
}

export const AccordionItem = ({ title, icon: Icon, children }: AccordionItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const toggleAccordion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

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
        <Animated.View style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}>
          <ChevronDown size={20} color={isDark ? '#9ca3af' : '#4b5563'} />
        </Animated.View>
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.content}>
          {children}
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 12,
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
