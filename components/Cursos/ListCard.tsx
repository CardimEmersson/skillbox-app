import { Colors } from "@/constants/Colors";
import { Text, View } from "react-native";
import { ListCardLayout } from "../ui/ListCardLayout";

interface ListCardProps {
  onPress: () => void;
  name: string;
  institution: string;
  workload: number;
}

export function ListCard({ onPress, name, institution, workload }: ListCardProps) {
  return (
    <ListCardLayout colors={[...Colors.orangeGradient] as [string, string, ...string[]]} onEdit={onPress}>
      <View className='w-full flex'>
        <Text className='font-inter-semibold text-2xl text-start'>{name}</Text>
      </View>
      <View className='w-full flex flex-row justify-between mt-4'>
        <Text className='font-inter-light text-lg text-start'>{institution}</Text>
        <Text className='font-inter-light text-lg text-start'>{workload} hora{workload > 1 ? 's' : ''}</Text>
      </View>

    </ListCardLayout>
  )
}