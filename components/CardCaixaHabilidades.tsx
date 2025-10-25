import { LinearGradient } from "expo-linear-gradient";
import { ColorValue, Pressable, Text, View } from "react-native";

interface CardCaixaHabilidadesProps {
  colors: readonly [ColorValue, ColorValue, ...ColorValue[]];
  classNameWrapper?: string;
  classNameContent?: string;
  label: string;
  value: string;
  onPress: () => void;
}

export function CardCaixaHabilidades({ colors, classNameWrapper, classNameContent, label, value, onPress }: CardCaixaHabilidadesProps) {

  return (
    <Pressable onPress={onPress}>
    <View className={`rounded-3xl overflow-hidden ${classNameWrapper}`}>
      <LinearGradient
        colors={colors}
        className={`p-2 flex items-center justify-center ${classNameContent}`}
      >
        <Text className='color-white font-bold text-4xl'>{value}</Text>
        <Text className='color-white font-light text-xl'>{label}</Text>
      </LinearGradient>
    </View>
    </Pressable>
  )
}