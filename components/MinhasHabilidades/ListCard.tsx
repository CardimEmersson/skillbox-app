import { Colors } from "@/constants/Colors";
import { Image, Text, View } from "react-native";
import { ListCardLayout } from "../ui/ListCardLayout";

interface ListCardProps {
  onPress: () => void;
  name: string;
  nivel: string;
  percentual: number;
}

export function ListCard({ onPress, name, nivel, percentual }: ListCardProps) {
  return (
    <ListCardLayout colors={[...Colors.greenGradient] as [string, string, ...string[]]} onEdit={onPress}>
      <View className='w-full flex flex-row items-center'>
        <Image
          source={{ uri: 'https://picsum.photos/seed/react/600/400' }}
          className="w-12 h-12 rounded-full"
        />
        <View className='flex-1 mr-auto ml-2'>
          <Text className='font-inter-semibold text-2xl text-start'>{name}</Text>
          <Text className='font-inter-light text-lg text-start'>{nivel}</Text>
        </View>
      </View>
      <View className="w-full h-3 bg-white rounded-full my-2">
        <View className="h-3 bg-green rounded-full" style={{ width: `${percentual}%` }} />
      </View>
    </ListCardLayout>
  )
}