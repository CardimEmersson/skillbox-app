import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

interface ListCardPreviewProps {
  name: string;
}

export function ListCardPreview({ name }: ListCardPreviewProps) {

  return (
    <View className={`rounded-xl overflow-hidden mt-2 w-[49%]`}>
      <LinearGradient colors={[...Colors.pinkGradient] as [string, string, ...string[]]} className="py-2 px-4">
        <View className='w-full flex'>
          <Text className='font-inter-semibold text-lg text-center'>{name}</Text>
        </View>
      </LinearGradient>
    </View>
  )
}