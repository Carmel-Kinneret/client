import { Pressable, View } from 'react-native';
import { Text } from '@/components/nativewindui/Text';

type FilterChipsProps = {
  categories: string[];
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
  onClearFilters: () => void;
};

export function FilterChips({ categories, selectedCategories, onToggleCategory, onClearFilters }: FilterChipsProps) {
  return (
    <View className="flex-row flex-wrap gap-2">
      <Pressable onPress={onClearFilters} className="rounded-full border border-border bg-card px-4 py-2">
        <Text className="text-[13px] font-semibold text-foreground">All</Text>
      </Pressable>
      {categories.map((category) => {
        const isSelected = selectedCategories.includes(category);
        return (
          <Pressable
            key={category}
            onPress={() => onToggleCategory(category)}
            className={isSelected ? 'rounded-full bg-primary px-4 py-2' : 'rounded-full border border-border bg-card px-4 py-2'}
          >
            <Text className={isSelected ? 'text-[13px] font-semibold text-primary-foreground' : 'text-[13px] font-semibold text-foreground'}>
              {category}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}