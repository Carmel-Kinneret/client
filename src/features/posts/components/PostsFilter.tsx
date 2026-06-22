import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import { useSettingsStore } from '@/lib/store/useSettingsStore';

const FILTER_OPTIONS = [
  { id: 'recent', label: 'Most Recent' },
  { id: 'liked', label: 'Most Liked' },
  { id: 'nearest', label: 'Nearest to me' },
];

export const PostsFilter = ({ 
  selectedId = 'recent', 
  onSelect 
}: { 
  selectedId?: string;
  onSelect: (id: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isDark = useSettingsStore((state) => state.isDarkMode);

  const selectedLabel = FILTER_OPTIONS.find(o => o.id === selectedId)?.label || 'Filter';

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button, isDark && styles.buttonDark]}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.buttonText, isDark && styles.textDark]}>{selectedLabel}</Text>
        <ChevronDown size={16} color={isDark ? '#d1d5db' : '#4b5563'} />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setIsOpen(false)}
        >
          <View style={[styles.dropdown, isDark && styles.dropdownDark]}>
            <Text style={styles.dropdownTitle}>Sort Posts</Text>
            {FILTER_OPTIONS.map((option) => {
              const isSelected = option.id === selectedId;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.option, 
                    isSelected && styles.optionSelected,
                    isDark && isSelected && styles.optionSelectedDark
                  ]}
                  onPress={() => {
                    onSelect(option.id);
                    setIsOpen(false);
                  }}
                >
                  <Text style={[
                    styles.optionText, 
                    isDark && styles.textDarkSecondary,
                    isSelected && styles.optionTextSelected,
                    isDark && isSelected && styles.optionTextSelectedDark
                  ]}>
                    {option.label}
                  </Text>
                  {isSelected && <Check size={18} color={isDark ? '#60a5fa' : '#3b82f6'} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonDark: {
    backgroundColor: '#374151',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginRight: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    backgroundColor: '#ffffff',
    width: 250,
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  dropdownDark: {
    backgroundColor: '#1f2937',
    shadowOpacity: 0.5,
  },
  dropdownTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9ca3af',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  optionSelected: {
    backgroundColor: '#eff6ff',
  },
  optionSelectedDark: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  optionText: {
    fontSize: 15,
    color: '#4b5563',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  optionTextSelectedDark: {
    color: '#60a5fa',
  },
  textDark: {
    color: '#f9fafb',
  },
  textDarkSecondary: {
    color: '#d1d5db',
  },
});
