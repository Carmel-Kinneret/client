import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronDown } from 'lucide-react-native';
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
          <ChevronDown size={28} color={isDark ? '#f9fafb' : '#111827'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>תנאי שימוש</Text>
        <View style={{ width: 44 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, isDark && styles.textDark]}>ברוכים הבאים לאפליקציית כרמל-כנרת</Text>
        
        <Text style={[styles.paragraph, isDark && styles.textDarkSecondary]}>
          על ידי שימוש באפליקציה שלנו, אתה מסכים לתנאים הבאים. אנא קרא אותם בקפידה.
          פלטפורמה זו מיועדת לשיתוף רגעים ולגילוי מיקומים.
        </Text>

        <Text style={[styles.sectionTitle, isDark && styles.textDark]}>1. תוכן משתמש</Text>
        <Text style={[styles.paragraph, isDark && styles.textDarkSecondary]}>
          אתה שומר על זכויות הבעלות על התוכן שאתה מפרסם, אך מעניק לנו רישיון לא בלעדי להציג
          ולהפיץ אותו בתוך האפליקציה למשתמשים אחרים.
        </Text>

        <Text style={[styles.sectionTitle, isDark && styles.textDark]}>2. שימוש הולם</Text>
        <Text style={[styles.paragraph, isDark && styles.textDarkSecondary]}>
          אין להשתמש בפלטפורמה זו לשיתוף תוכן פוגעני, מזיק או בלתי חוקי.
          חשבונות המפרים תנאים אלו עלולים להיחסם.
        </Text>

        <Text style={[styles.sectionTitle, isDark && styles.textDark]}>3. נתוני מיקום</Text>
        <Text style={[styles.paragraph, isDark && styles.textDarkSecondary]}>
          אנו אוספים נתוני מיקום רק אם הופעלו במפורש כדי לספק תכונות תלויות-מיקום.
          אנחנו לא מוכרים את נתוני המיקום שלך לצדדים שלישיים.
        </Text>

        <Text style={[styles.sectionTitle, isDark && styles.textDark]}>4. ויתור על אחריות</Text>
        <Text style={[styles.paragraph, isDark && styles.textDarkSecondary]}>
          האפליקציה ניתנת "כמות שהיא" ללא כל התחייבות או ערובה.
          אנו לא מבטיחים זמן פעולה רצוף או אבטחת נתונים.
        </Text>

        <Text style={[styles.sectionTitle, isDark && styles.textDark]}>5. שינויים בתנאים</Text>
        <Text style={[styles.paragraph, isDark && styles.textDarkSecondary]}>
          אנו עשויים לעדכן את התנאים הללו מעת לעת. המשך השימוש באפליקציה
          מהווה הסכמה לתנאים המעודכנים.
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
    flexDirection: 'row-reverse',
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
    textAlign: 'center',
    flex: 1,
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
    width: '100%',
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 24,
    marginBottom: 8,
    width: '100%',
    textAlign: 'right',
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: '#4b5563',
    width: '100%',
    textAlign: 'right',
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
