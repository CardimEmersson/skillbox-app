import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { ColorValue, Pressable, View } from "react-native";

interface ListCardLayoutProps {
  colors: [ColorValue, ColorValue, ...ColorValue[]];
  children: ReactNode;
  onEdit?: () => void;
  showEdit?: boolean;
  className?: string;
}

export function ListCardLayout({ colors, children, onEdit, showEdit = true, className }: ListCardLayoutProps) {

  return (
    <View className={`rounded-xl overflow-hidden mt-5`}>
      <LinearGradient
        colors={colors}
        className={className ?? `py-4 px-6 relative`}
      >
        {children}
        {showEdit && <View className="flex flex-row absolute top-4 right-4">
          <Pressable onPress={onEdit}>
            <MaterialIcons name="edit" size={24} color="black" />
          </Pressable>
        </View>}
      </LinearGradient>
    </View>
  )
}