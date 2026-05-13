import React from 'react';
import { View } from 'react-native';

interface PageLayoutProps {
  children: React.ReactNode;
  showBottomTabs?: boolean;
  bottomMargin?: number;
}

const PageLayout = ({ children, showBottomTabs = true, bottomMargin = 0 }: PageLayoutProps) => {
  return (
    <View className="flex-1" style={{ marginBottom: showBottomTabs ? bottomMargin : 0 }}>
      {children}
    </View>
  );
};

export default PageLayout;
