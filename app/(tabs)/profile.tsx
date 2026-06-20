import { View, Text, StyleSheet } from 'react-native';
import { ClarifiedAir } from '../../constants/theme';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Pending...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ClarifiedAir.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: ClarifiedAir.colors.textSecondary,
    fontWeight: 'bold',
  }
});
