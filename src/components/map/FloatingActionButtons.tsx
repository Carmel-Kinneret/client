import type { ComponentType } from 'react';
import { Pressable, View } from 'react-native';
import { LocateFixed, Minus, Plus } from 'lucide-react-native';
import { useColorScheme } from '@/lib/useColorScheme';

type FloatingActionButtonsProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleFollow: () => void;
  isFollowing: boolean;
};

export function FloatingActionButtons({ onZoomIn, onZoomOut, onToggleFollow, isFollowing }: FloatingActionButtonsProps) {
  const { colors } = useColorScheme();

  return (
    <View className="absolute bottom-6 right-4 gap-3">
      <ActionButton icon={Plus} color={colors.foreground} label="Zoom in" onPress={onZoomIn} />
      <ActionButton icon={Minus} color={colors.foreground} label="Zoom out" onPress={onZoomOut} />
      <ActionButton icon={LocateFixed} color={colors.foreground} label={isFollowing ? 'Following' : 'Follow me'} onPress={onToggleFollow} active={isFollowing} />
    </View>
  );
}

type ActionButtonProps = {
  icon: ComponentType<{ size?: number; color?: string }>;
  color: string;
  label: string;
  onPress: () => void;
  active?: boolean;
};

function ActionButton({ icon: Icon, color, label, onPress, active = false }: ActionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className={active ? 'h-12 w-12 items-center justify-center rounded-full bg-primary shadow-lg shadow-black/20' : 'h-12 w-12 items-center justify-center rounded-full bg-card shadow-lg shadow-black/20'}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Icon size={18} color={active ? 'white' : color} />
    </Pressable>
  );
}