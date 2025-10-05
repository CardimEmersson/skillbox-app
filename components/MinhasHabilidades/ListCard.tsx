import { Colors } from "@/constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Pressable, Text, View } from "react-native";

interface ListCardProps {
  onPress: () => void;
  name: string;
  nivel: string;
}

export function ListCard({ onPress, name, nivel }: ListCardProps) {
  return (
    <View className={`rounded-xl overflow-hidden mt-5`}>
      <LinearGradient
        colors={[...Colors.greenGradient] as [string, string, ...string[]]}
        className={`py-4 px-6`}
      >
        <View className='w-full flex flex-row items-center'>
          <Image
            source={{ uri: 'https://picsum.photos/seed/react/600/400' }}
            className="w-12 h-12 rounded-full"
          />
          <View className='flex-1 mr-auto ml-2'>
            <Text className='font-inter-semibold text-2xl text-start'>{name}</Text>
            <Text className='font-inter-regular text-lg text-start'>{nivel}</Text>
          </View>
          <Pressable onPress={onPress}>
            <MaterialIcons name="edit" size={24} color="black" />
          </Pressable>
        </View>
        <View className="w-full h-3 bg-white rounded-full my-2">
          <View className="h-3 bg-green rounded-full" style={{ width: '50%' }} />
        </View>
      </LinearGradient>
    </View>
  )
}