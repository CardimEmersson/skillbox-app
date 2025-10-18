import { Colors } from "@/constants/Colors";
import { Text, View } from "react-native";
import { ListCardLayout } from "../ui/ListCardLayout";

interface ListCardProps {
  onPress: () => void;
  name: string;
  subtitle: string;
  percentual: number;
}

export function ListCard({ onPress, name, subtitle, percentual }: ListCardProps) {
  return (
    <ListCardLayout colors={[...Colors.pinkGradient] as [string, string, ...string[]]} onEdit={onPress}>
      <View className='w-full flex'>
        <Text className='font-inter-semibold text-2xl text-start'>{name}</Text>
        <Text className='font-inter-light text-lg text-start'>{subtitle}</Text>
      </View>
      <View className="w-full h-3 bg-white rounded-full my-2">
        <View className="h-3 bg-pink rounded-full" style={{ width: `${percentual}%` }} />
      </View>
    </ListCardLayout>
  )
}