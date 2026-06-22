import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { Search, X } from 'lucide-react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
}

export function SearchBar({ value, onChangeText, onFocus }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View 
      className={`flex-row items-center bg-white rounded-full px-4 py-3 shadow-sm border ${isFocused ? 'border-blue-500' : 'border-transparent'}`}
    >
      <Search size={20} color={isFocused ? '#3b82f6' : '#9ca3af'} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search locations..."
        placeholderTextColor="#9ca3af"
        className="flex-1 ml-3 text-[16px] text-gray-800"
        onFocus={() => {
          setIsFocused(true);
          onFocus?.();
        }}
        onBlur={() => setIsFocused(false)}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity 
          onPress={() => {
            onChangeText('');
            Keyboard.dismiss();
          }}
          className="p-1"
        >
          <X size={18} color="#9ca3af" />
        </TouchableOpacity>
      )}
    </View>
  );
}
