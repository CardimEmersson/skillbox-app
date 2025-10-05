import { Colors } from "@/constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { FlatList, Pressable, Text, View } from "react-native";
import { BadgeListCard } from "./BadgeListCard";

interface ListCardProps {
  onPress: () => void;
  name: string;
  description: string;
  habilidades: string[];
}


export function ListCard({ onPress, name, description, habilidades }: ListCardProps) {
  return (
    <View className={`rounded-xl overflow-hidden mt-5`}>
      <LinearGradient
        colors={[...Colors.blueGradient] as [string, string, ...string[]]}
        className={`py-4 px-6`}
      >
        <View className="w-full flex">
          <View className='w-full flex flex-row items-center'>
            <View className='flex-1'>
              <Text className='font-inter-semibold text-2xl text-start'>{name}</Text>
              <Text className='font-inter-light text-lg text-start'>{description}</Text>
            </View>
            <Pressable onPress={onPress}>
              <MaterialIcons name="edit" size={24} color="black" />
            </Pressable>
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
      </LinearGradient>
    </View>
  )
}