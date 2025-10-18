import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { ColorValue, Pressable, Text, View } from "react-native";

interface BadgeCloseProps {
  name: string;
  onPress: () => void;
}

export function BadgeClose({ name, onPress }: BadgeCloseProps) {
  return (

    <View className="bg-light-gray rounded-lg py-1 px-2 mr-2 mb-2 flex flex-row items-center justify-between">
      <Text className='font-inter-semibold text-lg text-start mr-2'>{name}</Text>
      <Pressable onPress={onPress}>
        <Ionicons name="close" size={24} color="black" />
      </Pressable>
    </View>
  )
}

interface BadgeCloseGradientProps extends BadgeCloseProps {
  colors?: readonly [ColorValue, ColorValue, ...ColorValue[]];
}

export function BadgetCloseGradient({ name, onPress, colors }: BadgeCloseGradientProps) {
  return (
    <View className={"rounded-lg overflow-hidden mb-2 w-full"}>
      <LinearGradient
        colors={colors ?? ['#3874EA', '#3874EA']}
        className="py-4 px-4 flex flex-row items-center justify-between"
      >
        <Text className='font-inter-semibold text-xl text-start mr-2'>{name}</Text>
        <Pressable onPress={onPress}>
          <Ionicons name="close" size={24} color="black" />
        </Pressable>
      </LinearGradient>
    </View>
  )
}