// client/constants/theme.ts

export const ClarifiedAir = {
  colors: {
    background: '#F8F9FA', // Off-white/white base
    surface: '#FFFFFF', // Floating surfaces
    text: '#111827', // High contrast monochrome
    textSecondary: '#4B5563',
    primary: '#48BB78', // Leaf-green for routes and navigation
    accent: '#3182CE', // Deep water-blue for markers and active tabs
    destructive: '#E53E3E', // Subtle red for likes and destructive actions
  },
  spacing: {
    heavy: 32,
    generous: 24,
    comfortable: 16,
    tight: 8,
  },
  borderRadius: {
    pill: 9999, // Navigation bars and buttons
    card: 20, // Feed/content cards (16px to 20px)
  },
  shadows: {
    diffuse: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.05,
      shadowRadius: 20,
      elevation: 5, // Android fallback
    },
    floating: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 15 },
      shadowOpacity: 0.08,
      shadowRadius: 25,
      elevation: 8,
    }
  }
}
