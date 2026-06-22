import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useSettingsStore } from '@/lib/store/useSettingsStore';

export default function TermsScreen() {
  const router = useRouter();
  const isDark = useSettingsStore((state) => state.isDarkMode);

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={isDark ? '#f9fafb' : '#111827'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>Terms of Service</Text>
        <View style={{ width: 44 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, isDark && styles.textDark]}>Welcome to Carmel Kinneret App</Text>
        
        <Text style={[styles.paragraph, isDark && styles.textDarkSecondary]}>
          These Terms of Service ("Terms") govern your use of the Carmel Kinneret mobile application. 
          By using our app, you agree to these terms. If you do not agree to these terms, please do not use the app.
        </Text>

        <Text style={[styles.sectionTitle, isDark && styles.textDark]}>1. User Content</Text>
        <Text style={[styles.paragraph, isDark && styles.textDarkSecondary]}>
          When you post content (photos, captions, location data), you retain ownership of your content. 
          However, you grant us a non-exclusive, worldwide, royalty-free license to use, store, display, 
          and distribute your content in connection with operating the app.
        </Text>

        <Text style={[styles.sectionTitle, isDark && styles.textDark]}>2. Acceptable Use</Text>
        <Text style={[styles.paragraph, isDark && styles.textDarkSecondary]}>
          You agree not to post content that is illegal, abusive, harassing, or violates the rights of others. 
          We reserve the right to remove any content or suspend accounts that violate these guidelines without prior notice.
        </Text>

        <Text style={[styles.sectionTitle, isDark && styles.textDark]}>3. Location Data</Text>
        <Text style={[styles.paragraph, isDark && styles.textDarkSecondary]}>
          The app relies on location services to provide trail and point-of-interest information. 
          You can enable or disable location services in the app settings or your device settings at any time. 
          If disabled, some features of the app may not function properly.
        </Text>

        <Text style={[styles.sectionTitle, isDark && styles.textDark]}>4. Disclaimer of Warranties</Text>
        <Text style={[styles.paragraph, isDark && styles.textDarkSecondary]}>
          The app and its content are provided "as is" without warranties of any kind. 
          We do not guarantee that the trails, POIs, or user posts are perfectly accurate or safe. 
          Hiking involves inherent risks, and you use the app at your own risk.
        </Text>

        <Text style={[styles.sectionTitle, isDark && styles.textDark]}>5. Changes to Terms</Text>
        <Text style={[styles.paragraph, isDark && styles.textDarkSecondary]}>
          We may update these terms from time to time. We will notify you of any significant changes by posting the new terms on this page.
        </Text>
        
        <View style={styles.footerSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerTitleDark: {
    color: '#f9fafb',
  },
  scrollContent: {
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 24,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: '#4b5563',
  },
  textDark: {
    color: '#f9fafb',
  },
  textDarkSecondary: {
    color: '#9ca3af',
  },
  footerSpacer: {
    height: 40,
  },
});
