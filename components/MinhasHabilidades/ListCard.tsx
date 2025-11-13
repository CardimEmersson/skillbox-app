import { Colors } from "@/constants/Colors";
import { sizes } from "@/constants/Sizes";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, Text, View } from "react-native";
import { ListCardLayout } from "../ui/ListCardLayout";

interface ListCardProps {
  onPress: () => void;
  name: string;
  nivel: string;
  percentual: number;
  image?: string | null;
}

export function ListCard({ onPress, name, nivel, percentual, image }: ListCardProps) {
  return (
    <ListCardLayout colors={[...Colors.greenGradient] as [string, string, ...string[]]} onEdit={onPress}>
      <View className='w-full flex flex-row items-center'>
        {image ? (
          <Image
            source={{ uri: image }}
            className="w-12 h-12 rounded-full"
          />
        ) : (
          <View className="w-12 h-12 rounded-full bg-zinc-200 items-center justify-center">
            <Ionicons name="ribbon-outline" size={sizes.icons.lg} color={Colors.light.text} />
          </View>
        )}
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