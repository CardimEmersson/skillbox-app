import { Text, View } from "react-native";

interface BadgeListCardProps {
  name: string;
}

export function BadgeListCard({name}: BadgeListCardProps) {

  return (
    <View className="bg-light-gray rounded-lg py-1 px-2 mr-2">
      <Text className='font-inter-regular text-lg text-start'>{name}</Text>
    </View>
  )
}