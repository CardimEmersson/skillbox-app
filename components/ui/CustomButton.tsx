import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { ColorValue, Text, TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import { Spinner } from './Spinner';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  textClassName?: string;
  colors?: readonly [ColorValue, ColorValue, ...ColorValue[]];
  isLoading?: boolean;
  variant?: 'solid' | 'outlined';
  rightIcon?: ReactNode;
  finalColor?: number;
}

export function CustomButton({ title, className, textClassName, colors, isLoading, variant = 'solid', rightIcon, finalColor = 0, ...props }: CustomButtonProps) {
  const finalColors = colors ?? ['#3874EA', '#3874EA'];
  const mainColor = finalColors[finalColor] as string;

  if (variant === 'outlined') {
    return (
      <TouchableOpacity
        {...props}
        activeOpacity={0.8}
        style={[{ borderColor: mainColor, borderWidth: 2 }]}
        className={`rounded-xl flex-row items-center justify-center py-[14px] px-4 ${className} ${isLoading ? 'opacity-70' : ''}`}
        disabled={isLoading || props.disabled}
      >
        {isLoading ? (
          <Spinner size="small" color={mainColor} />
        ) : (
          <>
            <Text style={{ color: mainColor }} className={`text-center font-inter-bold text-base ${textClassName}`}>
              {title}
            </Text>
            {rightIcon && <View className="ml-2">{rightIcon}</View>}
          </>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.8}
      className={`rounded-xl overflow-hidden ${className} ${isLoading ? 'opacity-70' : ''}`}
      disabled={isLoading || props.disabled}
    >
      <LinearGradient colors={finalColors} className="flex-row items-center justify-center py-4 px-4">
        {isLoading ? (
          <Spinner size="small" color="white" />
        ) : (
          <>
            <Text className={`text-white text-center font-inter-bold text-base ${textClassName}`}>{title}</Text>
            {rightIcon && <View className="ml-2">{rightIcon}</View>}
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}