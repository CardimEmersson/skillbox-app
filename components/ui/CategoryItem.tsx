import { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

interface CategoryItemProps {
  className?: string;
  title: string;
  icon?: ReactNode;
  onPress?: () => void;
}

export function CategoryItem({className, title, icon, onPress}: CategoryItemProps) {
  return (
    <Pressable onPress={onPress}>
      <View className='mx-1 items-center'>
        <View className={`w-16 h-16 rounded-full items-center justify-center mb-1 ${className}`}>
          {icon}
        </View>
        <Text className="text-center font-inter-regular color-text">{title}</Text>
      </View>
    </Pressable>
  )
}