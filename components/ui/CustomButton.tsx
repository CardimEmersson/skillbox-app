import { LinearGradient } from 'expo-linear-gradient';
import { ColorValue, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  textClassName?: string;
  colors?: readonly [ColorValue, ColorValue, ...ColorValue[]];
}

export function CustomButton({ title, className, textClassName, colors, ...props }: CustomButtonProps) {
  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.8}
      className={`rounded-xl overflow-hidden ${className}`}
    >
      <LinearGradient
        colors={colors ?? ['#3874EA', '#3874EA']}
        className="items-center justify-center py-4 px-4"
      >
        <Text className={`text-white text-center font-inter-bold text-14 ${textClassName}`}>
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}