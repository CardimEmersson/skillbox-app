import { LinearGradient } from 'expo-linear-gradient';
import { ColorValue, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Spinner } from './Spinner';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  textClassName?: string;
  colors?: readonly [ColorValue, ColorValue, ...ColorValue[]];
  isLoading?: boolean;
}

export function CustomButton({ title, className, textClassName, colors, isLoading, ...props }: CustomButtonProps) {
  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.8}
      className={`rounded-xl overflow-hidden ${className} ${isLoading ? 'opacity-70' : ''}`}
      disabled={isLoading || props.disabled}
    >
      <LinearGradient
        colors={colors ?? ['#3874EA', '#3874EA']}
        className="items-center justify-center py-4 px-4"
      >
        {isLoading
          ? <Spinner size="small" color="white" />
          : <Text className={`text-white text-center font-inter-bold text-base ${textClassName}`}>{title}</Text>}
      </LinearGradient>
    </TouchableOpacity>
  );
}