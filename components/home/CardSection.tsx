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
    <View className="m-4 rounded-lg bg-gray-50 p-4 ">
      <View className="flex-row items-center justify-between">
        <Text variant="small" className="mb-4">
          {title}
        </Text>
        {viewMoreText && viewMoreHref ? (
          <Link href={viewMoreHref}>
            <Text variant="lead" className="text-primary">
              {viewMoreText}
            </Text>
          </Link>
        ) : null}
      </View>
      <View className="flex-row flex-wrap">
        {iconTextItems.map((item, index) => (
          <View
            key={item.navigateTo}
            className={`mb-8 ${index % 4 === 3 ? 'mr-0' : 'mr-[2.66%]'} w-[23%] `}>
            <IconWithText icon={item.icon} text={item.text} navigateTo={item.navigateTo} />
          </View>
        ))}
      </View>
    </View>
  );
};

export default CardSection;
