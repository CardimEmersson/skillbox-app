import { ReactNode } from "react";
import { View } from "react-native";

interface TabItemProps {
  focused: boolean;
  color: string;
  children: ReactNode;
}

export function TabItem({ focused, color, children }: TabItemProps) {
  return (
    <View style={{ alignItems: "center", justifyContent: "center"}}>
      {children}
      {focused && (
        <View
          style={{
            position: "absolute",
            top: -7,
            width: 10,
            height: 6,
            borderRadius: 5,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            backgroundColor: color,
          }}
        />
      )}
    </View>
  )
}