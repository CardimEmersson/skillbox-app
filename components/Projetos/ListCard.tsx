import { Colors } from "@/constants/Colors";
import { FlatList, Text, View } from "react-native";
import { ListCardLayout } from "../ui/ListCardLayout";
import { BadgeListCard } from "./BadgeListCard";

interface ListCardProps {
  onPress: () => void;
  name: string;
  description: string;
  habilidades: string[];
}


export function ListCard({ onPress, name, description, habilidades }: ListCardProps) {
  return (
    <ListCardLayout colors={[...Colors.blueGradient] as [string, string, ...string[]]} onEdit={onPress}>
      <View className="w-full flex">
        <View className='w-full flex flex-row items-center'>
          <View className='flex-1'>
            <Text className='font-inter-semibold text-2xl text-start'>{name}</Text>
            <Text className='font-inter-light text-lg text-start'>{description}</Text>
          </View>
        </View>

        <FlatList
          data={habilidades}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <BadgeListCard name={item} />
          )}
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerClassName="flex flex-row items-center"
        />
      </View>
    </ListCardLayout>
  )
}