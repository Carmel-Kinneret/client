import { Pressable, TextInput, View } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useColorScheme } from '@/lib/useColorScheme';

type SearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
  onSubmit?: () => void;
  onClear?: () => void;
  onFocus?: () => void;
  placeholder?: string;
};

export function SearchBar({
  value,
  onChangeText,
  onSubmit,
  onClear,
  onFocus,
  placeholder = 'Search by title or category',
}: SearchBarProps) {
  const { colors } = useColorScheme();

  return (
    <View className="flex-row items-center gap-3 rounded-3xl border border-border bg-card px-4 py-3 shadow-lg shadow-black/10">
      <Search size={18} color={colors.mutedForeground} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        onFocus={onFocus}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        className="min-h-[24px] flex-1 text-[15px] text-foreground"
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        accessibilityLabel="Search locations"
      />
      {value.length > 0 ? (
        <Pressable onPress={onClear} hitSlop={10} accessibilityRole="button" accessibilityLabel="Clear search">
          <X size={18} color={colors.mutedForeground} />
        </Pressable>
      ) : null}
    </View>
  );
}