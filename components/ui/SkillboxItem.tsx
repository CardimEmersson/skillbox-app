import { Text, View } from "react-native";

interface SkillboxItemProps {
  title: string;
  value: string;
  bgColor: "green" | "orange" | "pink" | "blue" | "red" | "purple" | "primary";
}

const bgColorClasses = {
  green: "bg-green",
  orange: "bg-orange",
  pink: "bg-pink",
  blue: "bg-blue",
  red: "bg-red",
  purple: "bg-purple",
  primary: "bg-primary",
};

export function SkillboxItem({title, value, bgColor}: SkillboxItemProps) {
  const bgClass = bgColorClasses[bgColor];
  return (
    <View className="w-[32%] rounded-xl overflow-hidden bg-[#F3F3F3] elevation-lg mb-4">
      <View className={bgClass}>
        <Text className="text-sm font-inter-bold text-center color-white p-1">{title}</Text>
      </View>
      <Text className="text-lg font-inter-bold text-center p-2">{value}</Text>
    </View>
  )
}