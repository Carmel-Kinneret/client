import { View, Text, StyleSheet } from 'react-native';
import { ClarifiedAir } from '../../constants/theme';

export default function FeedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Community Feed Pending...</Text>
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
