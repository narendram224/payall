import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Sun, Star } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function ThemeToggle({ size = 'md', showLabel = false }: ThemeToggleProps) {
  const { colorScheme, toggleTheme, theme } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      className={`flex-row items-center justify-center rounded-full ${sizeClasses[size]} ${
        colorScheme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'
      }`}
      style={{
        backgroundColor: colorScheme === 'dark' ? theme.colors.secondary : theme.colors.accent,
      }}>
      <View className="flex-row items-center gap-2">
        {colorScheme === 'dark' ? (
          <Sun width={iconSizes[size]} height={iconSizes[size]} color={theme.colors.text} />
        ) : (
          <Star width={iconSizes[size]} height={iconSizes[size]} color={theme.colors.text} />
        )}
        {showLabel && (
          <Text
            className={`text-sm font-medium ${
              colorScheme === 'dark' ? 'text-slate-100' : 'text-slate-900'
            }`}
            style={{ color: theme.colors.text }}>
            {colorScheme === 'dark' ? 'Light' : 'Dark'}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
