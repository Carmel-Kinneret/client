import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FavoritesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-bold text-gray-800">Your Favorites</Text>
        <Text className="text-gray-500 mt-2">Saved locations will appear here.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
});
