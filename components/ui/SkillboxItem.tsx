import { Text, View } from "react-native";

export type TypeColorsSkillbox = "green" | "orange" | "pink" | "blue" | "red" | "purple" | "primary";
interface SkillboxItemProps {
  title: string;
  value: string;
  bgColor: TypeColorsSkillbox;
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
    <View className="w-[49%] rounded-xl overflow-hidden bg-[#F3F3F3] elevation-lg mb-4">
      <View className={bgClass}>
        <Text className="text-sm font-inter-bold text-center color-white p-1">{title}</Text>
      </View>
      <Text className="text-base font-inter-bold text-center p-2">{value}</Text>
    </View>
  )
}

export function SkillboxItemSkeleton() {
  return (
    <View className="w-[49%] rounded-xl overflow-hidden bg-[#F3F3F3] elevation-lg mb-4">
      <View className='h-6 w-full bg-zinc-300 rounded mb-2' />
      <View className="flex items-center justify-center mb-2">
        <View className='h-6 w-1/2 bg-zinc-300 rounded' />
      </View>
    </View>
  )
}