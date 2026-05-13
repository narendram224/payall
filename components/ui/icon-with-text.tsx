import { Image, View } from 'react-native';
import { Text } from '@ui/text';
import { Link } from 'expo-router';

interface IconWithTextProps {
  icon: React.ReactNode;
  text: string;
  navigateTo?: string;
}

import { Pressable } from 'react-native';

const IconWithText = ({ icon, text, navigateTo }: IconWithTextProps) => {
  return (
    <Link href={navigateTo || '#'} asChild>
      <Pressable className="w-full flex-col items-center justify-start gap-1.5">
        {icon}
        <Text className="text-center text-xs font-medium text-gray-700" numberOfLines={2}>
          {text}
        </Text>
      </Pressable>
    </Link>
  );
};

export default IconWithText;
