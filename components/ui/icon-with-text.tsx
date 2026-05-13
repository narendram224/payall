import { Image, View } from 'react-native';
import { Text } from '@ui/text';
import { Link } from 'expo-router';

interface IconWithTextProps {
  icon: React.ReactNode;
  text: string;
  navigateTo?: string;
}

const IconWithText = ({ icon, text, navigateTo }: IconWithTextProps) => {
  return (
    <Link href={navigateTo || '#'} className="flex flex-col items-center gap-2">
      {icon}
      <Text variant="small" className="break-words text-center" numberOfLines={2}>
        {text}
      </Text>
    </Link>
  );
};

export default IconWithText;
