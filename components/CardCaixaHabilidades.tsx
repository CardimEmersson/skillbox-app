import { LinearGradient } from "expo-linear-gradient";
import { ColorValue, Pressable, Text, View } from "react-native";
import AnimatedNumbers from 'react-native-animated-numbers';
import { Spinner } from "./ui";

interface CardCaixaHabilidadesProps {
  colors: readonly [ColorValue, ColorValue, ...ColorValue[]];
  classNameWrapper?: string;
  classNameContent?: string;
  label: string;
  value: string;
  onPress: () => void;
  isLoading?: boolean;
}

export function CardCaixaHabilidades({ colors, classNameWrapper, classNameContent, label, value, onPress, isLoading }: CardCaixaHabilidadesProps) {
  
  return (
    <Pressable onPress={onPress}>
      <View className={`rounded-3xl overflow-hidden ${classNameWrapper}`}>
        <LinearGradient
          colors={colors}
          className={`p-2 flex items-center justify-center ${classNameContent}`}
        >
          {isLoading ? (
            <Spinner color="white" />
          ) : (
            <AnimatedNumbers
              animateToNumber={Number(value)}
              fontStyle={{ fontSize: 36, fontWeight: 'bold', color: "#fff" }}
            />
          )}
          <Text className='color-white font-light text-xl'>{label}</Text>
        </LinearGradient>
      </View>
    </Pressable>
  )
}