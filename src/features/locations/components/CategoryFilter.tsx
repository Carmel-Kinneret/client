import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';
import { Category } from '../types';

const CATEGORIES: Category[] = ['Restaurants', 'Cafes', 'Attractions', 'Parking', 'Other'];

interface CategoryFilterProps {
  selectedCategory: Category | null;
  onSelectCategory: (category: Category | null) => void;
}

const getCategoryLabel = (cat: Category) => {
  switch (cat) {
    case 'Restaurants': return 'מסעדות';
    case 'Cafes': return 'בתי קפה';
    case 'Attractions': return 'אטרקציות';
    case 'Parking': return 'חניה';
    case 'Other': return 'אחר';
    default: return cat;
  }
};

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8,
 }}
      className="max-h-[64px]"
    >
      <TouchableOpacity
        onPress={() => onSelectCategory(null)}
        className={`px-4 py-2 h-10 items-center justify-center rounded-full border ${!selectedCategory ? 'bg-gray-800 border-gray-800' : 'bg-white border-gray-300'}`}
        activeOpacity={0.7}
      >
        <Text className={`font-semibold ${!selectedCategory ? 'text-white' : 'text-gray-600'}`}>הכל</Text>
      </TouchableOpacity>

      {CATEGORIES.map((category) => {
        const isSelected = selectedCategory === category;
        return (
          <TouchableOpacity
            key={category}
            onPress={() => onSelectCategory(isSelected ? null : category)}
            className={`px-4 py-2 h-10 items-center justify-center rounded-full border ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}
            activeOpacity={0.7}
          >
            <Text className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-600'}`}>{getCategoryLabel(category)}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
