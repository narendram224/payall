import { DarkTheme, DefaultTheme } from '@react-navigation/native';

export type Theme = {
  colors: {
    primary: string;
    secondaryPrimary: string;
    lightPrimary: string;
    darkPrimary: string;
    mediumPrimary: string;
    secondary: string;
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    border: string;
    input: string;
    ring: string;
    text: string;
    whiteText: string;
    textSecondary: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    success: string;
    warning: string;
    info: string;
    notification: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    fontWeight: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
    };
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
};

export const themeConfig: Record<'light' | 'dark', Theme> = {
  light: {
    colors: {
      primary: '#6366f1',
      secondaryPrimary: '#F1F1FD',
      lightPrimary: '#EAEAFD',
      darkPrimary: '#8285F4',
      mediumPrimary: '#DEDFFC',
      secondary: '#f1f5f9',
      background: '#fafafa',
      foreground: '#1c1c1c',
      card: '#ffffff',
      cardForeground: '#1c1c1c',
      border: '#e2e8f0',
      input: '#f1f5f9',
      ring: '#6366f1',
      text: '#1c1c1c',
      whiteText: '#ffffff',
      textSecondary: '#6b7280',
      muted: '#f5f5f5',
      mutedForeground: '#6b7280',
      accent: '#f3f4f6',
      accentForeground: '#1c1c1c',
      destructive: '#ef4444',
      destructiveForeground: '#ffffff',
      success: '#10b981',
      warning: '#f59e0b',
      info: '#3b82f6',
      notification: '#ef4444',
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      xxl: '48px',
    },
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      full: '9999px',
    },
    typography: {
      fontFamily: 'System',
      fontSize: {
        xs: '12px',
        sm: '14px',
        md: '16px',
        lg: '18px',
        xl: '20px',
        xxl: '24px',
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(28, 28, 28, 0.05)',
      md: '0 4px 6px -1px rgba(28, 28, 28, 0.1), 0 2px 4px -1px rgba(28, 28, 28, 0.06)',
      lg: '0 10px 15px -3px rgba(28, 28, 28, 0.1), 0 4px 6px -2px rgba(28, 28, 28, 0.05)',
    },
  },
  dark: {
    colors: {
      primary: '#8b5cf6',
      secondaryPrimary: '#F1F1FD',
      lightPrimary: '#EAEAFD',
      darkPrimary: '#8285F4',
      mediumPrimary: '#DEDFFC',
      secondary: '#374151',
      background: '#1c1c1c',
      foreground: '#fafafa',
      card: '#2d2d2d',
      cardForeground: '#fafafa',
      border: '#374151',
      input: '#374151',
      ring: '#8b5cf6',
      text: '#fafafa',
      whiteText: '#ffffff',
      textSecondary: '#9ca3af',
      muted: '#2d2d2d',
      mutedForeground: '#9ca3af',
      accent: '#4b5563',
      accentForeground: '#fafafa',
      destructive: '#ef4444',
      destructiveForeground: '#ffffff',
      success: '#10b981',
      warning: '#f59e0b',
      info: '#3b82f6',
      notification: '#ef4444',
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      xxl: '48px',
    },
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      full: '9999px',
    },
    typography: {
      fontFamily: 'System',
      fontSize: {
        xs: '12px',
        sm: '14px',
        md: '16px',
        lg: '18px',
        xl: '20px',
        xxl: '24px',
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.28)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.28)',
    },
  },
};

export const NAV_THEME: Record<'light' | 'dark', typeof DefaultTheme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: themeConfig.light.colors.background,
      border: themeConfig.light.colors.border,
      card: themeConfig.light.colors.card,
      notification: themeConfig.light.colors.notification,
      primary: themeConfig.light.colors.primary,
      text: themeConfig.light.colors.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: themeConfig.dark.colors.background,
      border: themeConfig.dark.colors.border,
      card: themeConfig.dark.colors.card,
      notification: themeConfig.dark.colors.notification,
      primary: themeConfig.dark.colors.primary,
      text: themeConfig.dark.colors.foreground,
    },
  },
};
