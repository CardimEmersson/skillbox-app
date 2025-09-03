import { TouchableOpacity, TouchableOpacityProps } from "react-native";

interface IconButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
}

export function IconButton({ children, className, ...props }: IconButtonProps) {
  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.8}
      className={`rounded-xl overflow-hidden p-4 bg-white ${className}`}
    >
      {children}
    </TouchableOpacity>
  )
}