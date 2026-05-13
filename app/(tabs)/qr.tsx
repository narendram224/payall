import { View, ScrollView } from 'react-native';
import { Text } from '../../components/ui/text';
import { Button } from '../../components/ui/button';
import { useTheme } from '../../context/ThemeContext';
import { QrCode, Camera, Smartphone, Download } from 'lucide-react-native';

export default function QRScreen() {
  const { theme, colorScheme } = useTheme();

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
      className="flex-1">
      <View className="space-y-6 p-6">
        {/* QR Code Display */}
        <View
          className="items-center rounded-2xl p-6"
          style={{
            backgroundColor: theme.colors.card,
            shadowColor: colorScheme === 'dark' ? '#000' : '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 8,
          }}>
          <QrCode size={200} color={theme.colors.text} />
          <Text variant="h3" className="mt-4 text-center text-lg font-semibold">
            Your QR Code
          </Text>
          <Text variant="muted" className="mt-2 text-center">
            Scan to receive money instantly
          </Text>
        </View>

        {/* QR Actions */}
        <View className="space-y-3">
          <Text variant="h3" className="text-lg font-semibold">
            Quick Actions
          </Text>
          <View className="space-y-3">
            <Button className="flex-row items-center justify-center gap-3 p-4">
              <Camera size={20} color="#ffffff" />
              <Text>Scan QR Code</Text>
            </Button>
            <Button variant="outline" className="flex-row items-center justify-center gap-3 p-4">
              <Download size={20} color={theme.colors.primary} />
              <Text>Download QR</Text>
            </Button>
          </View>
        </View>

        {/* Payment Methods */}
        <View className="space-y-3">
          <Text variant="h3" className="text-lg font-semibold">
            Payment Methods
          </Text>
          <View className="space-y-3">
            <View
              className="flex-row items-center justify-between rounded-lg p-4"
              style={{ backgroundColor: theme.colors.card }}>
              <View className="flex-row items-center gap-3">
                <View
                  className="h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: theme.colors.primary }}>
                  <Smartphone size={20} color="#ffffff" />
                </View>
                <View>
                  <Text className="font-medium">UPI Payment</Text>
                  <Text variant="muted" className="text-sm">
                    Instant transfers
                  </Text>
                </View>
              </View>
              <Text variant="muted">●</Text>
            </View>

            <View
              className="flex-row items-center justify-between rounded-lg p-4"
              style={{ backgroundColor: theme.colors.card }}>
              <View className="flex-row items-center gap-3">
                <View
                  className="h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: theme.colors.secondary }}>
                  <QrCode size={20} color={theme.colors.text} />
                </View>
                <View>
                  <Text className="font-medium">QR Code</Text>
                  <Text variant="muted" className="text-sm">
                    Scan & Pay
                  </Text>
                </View>
              </View>
              <Text variant="muted">●</Text>
            </View>
          </View>
        </View>

        {/* Recent Scans */}
        <View className="space-y-3">
          <Text variant="h3" className="text-lg font-semibold">
            Recent Scans
          </Text>
          <View className="space-y-3">
            <View
              className="flex-row items-center justify-between rounded-lg p-4"
              style={{ backgroundColor: theme.colors.card }}>
              <View>
                <Text className="font-medium">Merchant Payment</Text>
                <Text variant="muted" className="text-sm">
                  Starbucks Coffee • Today, 9:15 AM
                </Text>
              </View>
              <Text className="font-semibold">₹250.00</Text>
            </View>

            <View
              className="flex-row items-center justify-between rounded-lg p-4"
              style={{ backgroundColor: theme.colors.card }}>
              <View>
                <Text className="font-medium">Person to Person</Text>
                <Text variant="muted" className="text-sm">
                  Amit Kumar • Yesterday, 6:30 PM
                </Text>
              </View>
              <Text className="font-semibold">₹1,000.00</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
