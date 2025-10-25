import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

interface ListCardPerfilProps {
  name: string;
  institution: string;
}

export function ListCardPerfil({ name, institution }: ListCardPerfilProps) {

  return (
    <View className={`rounded-xl overflow-hidden mt-2`}>
      <LinearGradient colors={[...Colors.orangeGradient] as [string, string, ...string[]]} className="py-2 px-4">
        <View className='w-full flex'>
          <Text className='font-inter-semibold text-lg text-start'>{name}</Text>
        </View>
        <View className='w-full flex flex-row justify-between mt-1'>
          <Text className='font-inter-light text-base'>{institution}</Text>
        </View>
      </LinearGradient>
    </View>
  )
}