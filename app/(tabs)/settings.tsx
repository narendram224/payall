import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { ThemeToggle } from '../../components/ThemeToggle';

export default function SettingsScreen() {
  const { theme, colorScheme, toggleTheme } = useTheme();

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
      className="flex-1">
      <View className="space-y-6 p-6">
        <View className="space-y-2">
          <Text className="text-2xl font-bold" style={{ color: theme.colors.text }}>
            Settings
          </Text>
          <Text className="text-sm" style={{ color: theme.colors.textSecondary }}>
            Customize your app experience
          </Text>
        </View>

        <View
          className="space-y-4 rounded-lg p-4"
          style={{
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
            borderWidth: 1,
          }}>
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-lg font-medium" style={{ color: theme.colors.text }}>
                Theme
              </Text>
              <Text className="text-sm" style={{ color: theme.colors.textSecondary }}>
                {colorScheme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </Text>
            </View>
            <ThemeToggle size="md" showLabel={false} />
          </View>
        </View>

        <View
          className="space-y-4 rounded-lg p-4"
          style={{
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
            borderWidth: 1,
          }}>
          <Text className="mb-2 text-lg font-medium" style={{ color: theme.colors.text }}>
            Theme Preview
          </Text>

          <View className="space-y-3">
            <View className="flex-row items-center justify-between">
              <Text style={{ color: theme.colors.text }}>Primary Color</Text>
              <View
                className="h-6 w-6 rounded-full"
                style={{ backgroundColor: theme.colors.primary }}
              />
            </View>

            <View className="flex-row items-center justify-between">
              <Text style={{ color: theme.colors.text }}>Background</Text>
              <View
                className="h-6 w-6 rounded-full border"
                style={{
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                }}
              />
            </View>

            <View className="flex-row items-center justify-between">
              <Text style={{ color: theme.colors.text }}>Card</Text>
              <View
                className="h-6 w-6 rounded-full border"
                style={{
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                }}
              />
            </View>

            <View className="flex-row items-center justify-between">
              <Text style={{ color: theme.colors.text }}>Success</Text>
              <View
                className="h-6 w-6 rounded-full"
                style={{ backgroundColor: theme.colors.success }}
              />
            </View>

            <View className="flex-row items-center justify-between">
              <Text style={{ color: theme.colors.text }}>Warning</Text>
              <View
                className="h-6 w-6 rounded-full"
                style={{ backgroundColor: theme.colors.warning }}
              />
            </View>

            <View className="flex-row items-center justify-between">
              <Text style={{ color: theme.colors.text }}>Destructive</Text>
              <View
                className="h-6 w-6 rounded-full"
                style={{ backgroundColor: theme.colors.destructive }}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={toggleTheme}
          className="items-center rounded-lg p-4"
          style={{
            backgroundColor: theme.colors.accent,
            borderColor: theme.colors.border,
            borderWidth: 1,
          }}>
          <Text className="font-medium" style={{ color: theme.colors.accentForeground }}>
            Toggle Theme
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
