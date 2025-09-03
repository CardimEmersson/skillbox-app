import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";

interface BackgroundGradientProps {
  children: ReactNode;
  className?: string;
}

export function BackgroundGradient({ children, className }: BackgroundGradientProps) {
  return (
    <LinearGradient
      colors={['#EBC894', '#B49EF4']}
      start={{ x: 0, y: 0.3 }}
      end={{ x: 0.7, y: 1 }}
      className={`flex-1 ${className}`}
    >
      {children}
    </LinearGradient>
  )
}