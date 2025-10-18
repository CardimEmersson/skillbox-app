import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { ColorValue, Pressable, View } from "react-native";

interface ListCardLayoutProps {
  colors: [ColorValue, ColorValue, ...ColorValue[]];
  children: ReactNode;
  onEdit: () => void;
}

export function ListCardLayout({ colors, children, onEdit }: ListCardLayoutProps) {

  return (
    <View className={`rounded-xl overflow-hidden mt-5`}>
      <LinearGradient
        colors={colors}
        className={`py-4 px-6 relative`}
      >
        {children}
        <View className="flex flex-row absolute top-4 right-4">
          <Pressable onPress={onEdit}>
            <MaterialIcons name="edit" size={24} color="black" />
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  )
}