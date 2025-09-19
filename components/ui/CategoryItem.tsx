import { ReactNode } from "react";
import { Text, View } from "react-native";

interface CategoryItemProps {
  className?: string;
  title: string;
  icon?: ReactNode;
}

export function CategoryItem({className, title, icon}: CategoryItemProps) {
  return (
    <View className='mx-1'>
      <View className={`w-16 h-16 rounded-full items-center justify-center mb-1 ${className}`}>
        {icon}
      </View>
      <Text className="text-center font-inter-regular color-text">{title}</Text>
    </View>
  )
}