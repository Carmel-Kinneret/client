import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActionSheetIOS, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { X, RefreshCw, Send } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSettingsStore } from '@/lib/store/useSettingsStore';

export default function CreatePostScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [imageUri, setImageUri] = useState<string>((params.imageUri as string) || '');
  const [caption, setCaption] = useState('');
  const isDark = useSettingsStore((state) => state.isDarkMode);

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleRetake = () => {
    const options = ['צלם תמונה', 'בחר מהגלריה', 'ביטול'];
    const cancelButtonIndex = 2;

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options, cancelButtonIndex },
        (buttonIndex) => {
          if (buttonIndex === 0) takePhoto();
          else if (buttonIndex === 1) pickImage();
        }
      );
    } else {
      Alert.alert(
        'החלף תמונה',
        'בחר מקור תמונה',
        [
          { text: 'צלם תמונה', onPress: takePhoto },
          { text: 'בחר מהגלריה', onPress: pickImage },
          { text: 'ביטול', style: 'cancel' },
        ]
      );
    }
  };

  const handlePost = () => {
    if (!imageUri) {
      Alert.alert('שגיאה', 'חובה להוסיף תמונה.');
      return;
    }
    // TODO: Connect to backend API to upload post
    console.log('Posting:', { imageUri, caption });
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.headerButton} 
                onPress={() => router.back()}
              >
                <X size={28} color={isDark ? '#f9fafb' : '#111827'} />
              </TouchableOpacity>
              <Text style={[styles.headerTitle, isDark && styles.textDark]}>פוסט חדש</Text>
              <View style={styles.placeholder} />
            </View>

            {/* Image Preview */}
            <View style={styles.imageContainer}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              ) : (
                <View style={[styles.imagePlaceholder, isDark && styles.imagePlaceholderDark]}>
                  <Text style={[styles.imagePlaceholderText, isDark && styles.textDarkSecondary]}>אין תמונה</Text>
                </View>
              )}
              
              <TouchableOpacity style={styles.retakeButton} onPress={handleRetake}>
                <RefreshCw size={20} color="#ffffff" />
                <Text style={styles.retakeText}>החלף תמונה</Text>
              </TouchableOpacity>
            </View>

            {/* Caption Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                placeholder="שתף חוויה..."
                placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                value={caption}
                onChangeText={setCaption}
                multiline
                textAlign="right"
                autoFocus
              />
            </View>

            {/* Bottom Actions */}
            <View style={styles.footer}>
              <TouchableOpacity 
                style={[styles.postButton, !imageUri && styles.postButtonDisabled]} 
                onPress={handlePost}
                disabled={!imageUri}
              >
                <Send size={20} color="#ffffff" style={{ marginLeft: 8 }} />
                <Text style={styles.postButtonText}>פרסם</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
  inner: {
    flex: 1,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    flex: 1,
  },
  placeholder: {
    width: 44,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f3f4f6',
    position: 'relative',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  imagePlaceholderDark: {
    backgroundColor: '#1f2937',
  },
  imagePlaceholderText: {
    color: '#6b7280',
    fontSize: 16,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  retakeButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  retakeText: {
    color: '#ffffff',
    fontWeight: '600',
    marginRight: 8,
  },
  inputContainer: {
    flex: 1,
    padding: 16,
  },
  input: {
    fontSize: 18,
    color: '#111827',
    paddingTop: 16,
    textAlignVertical: 'top',
  },
  inputDark: {
    color: '#f9fafb',
  },
  footer: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 0 : 16,
  },
  postButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  postButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textDark: {
    color: '#f9fafb',
  },
  textDarkSecondary: {
    color: '#9ca3af',
  },
});
