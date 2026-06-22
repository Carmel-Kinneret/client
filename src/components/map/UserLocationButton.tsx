import { Pressable } from 'react-native';
import { Crosshair } from 'lucide-react-native';
import { useColorScheme } from '@/lib/useColorScheme';

type UserLocationButtonProps = {
  onPress: () => void;
  enabled: boolean;
};

export function UserLocationButton({ onPress, enabled }: UserLocationButtonProps) {
  const { colors } = useColorScheme();

  return (
    <Pressable
      onPress={onPress}
      className={enabled ? 'h-12 w-12 items-center justify-center rounded-full bg-primary' : 'h-12 w-12 items-center justify-center rounded-full bg-card'}
      accessibilityRole="button"
      accessibilityLabel={enabled ? 'Disable follow user mode' : 'Enable follow user mode'}
    >
      <Crosshair size={18} color={enabled ? 'white' : colors.foreground} />
    </Pressable>
  );
}