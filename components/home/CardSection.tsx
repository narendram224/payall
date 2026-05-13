import { View } from 'react-native';
import { Text } from '@ui/text';
import IconWithText from '@ui/icon-with-text';
import { Link } from 'expo-router';

interface IconTextItem {
  icon: React.ReactNode;
  text: string;
  navigateTo: string;
}

interface CardSectionProps {
  title: string;
  iconTextItems: IconTextItem[];
  viewMoreText?: string;
  viewMoreHref?: string;
}

const CardSection = ({
  title,
  iconTextItems,
  viewMoreText = '',
  viewMoreHref = '',
}: CardSectionProps) => {
  return (
    <View className="mx-4 my-2 overflow-hidden rounded-2xl bg-white p-4 shadow-sm elevation-2">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-lg font-bold text-gray-800">
          {title}
        </Text>
        {viewMoreText && viewMoreHref ? (
          <Link href={viewMoreHref as any}>
            <Text className="font-semibold text-[#00B9F2]">
              {viewMoreText}
            </Text>
          </Link>
        ) : null}
      </View>
      <View className="flex-row flex-wrap">
        {iconTextItems.map((item, index) => (
          <View
            key={item.navigateTo}
            className={`mb-8 ${index % 4 === 3 ? 'mr-0' : 'mr-[2.66%]'} w-[23%]`}>
            <IconWithText icon={item.icon} text={item.text} navigateTo={item.navigateTo} />
          </View>
        ))}
      </View>
    </View>
  );
};

export default CardSection;
