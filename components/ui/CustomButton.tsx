import { LinearGradient } from 'expo-linear-gradient';
import { ColorValue, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Spinner } from './Spinner';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  textClassName?: string;
  colors?: readonly [ColorValue, ColorValue, ...ColorValue[]];
  isLoading?: boolean;
  variant?: 'solid' | 'outlined';
}

export function CustomButton({ title, className, textClassName, colors, isLoading, variant = 'solid', ...props }: CustomButtonProps) {
  const finalColors = colors ?? ['#3874EA', '#3874EA'];
  const mainColor = finalColors[0] as string;

  if (variant === 'outlined') {
    return (
      <TouchableOpacity
        {...props}
        activeOpacity={0.8}
        style={[{ borderColor: mainColor, borderWidth: 2 }]}
        className={`rounded-xl items-center justify-center py-[14px] px-4 ${className} ${isLoading ? 'opacity-70' : ''}`}
        disabled={isLoading || props.disabled}
      >
        {isLoading ? (
          <Spinner size="small" color={mainColor} />
        ) : (
          <Text style={{ color: mainColor }} className={`text-center font-inter-bold text-base ${textClassName}`}>
            {title}
          </Text>
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
      <LinearGradient colors={finalColors} className="items-center justify-center py-4 px-4">
        {isLoading ? (
          <Spinner size="small" color="white" />
        ) : (
          <Text className={`text-white text-center font-inter-bold text-base ${textClassName}`}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}