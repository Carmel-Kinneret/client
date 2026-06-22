import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PostsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-bold text-gray-800">Posts</Text>
        <Text className="text-gray-500 mt-2">Your posts will appear here.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
});
