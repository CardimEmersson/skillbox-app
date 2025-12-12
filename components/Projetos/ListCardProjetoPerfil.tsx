import { useThemeColor } from '@/hooks/useThemeColor';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { FlatList, Image, Text, View } from "react-native";

interface ListCardProjetoPerfilProps {
  title: string;
  image: string;
  skills: string[];
}

export function ListCardProjetoPerfil({ title, image, skills }: ListCardProjetoPerfilProps) {
  const color = useThemeColor({}, 'text');

  return (
    <View className="rounded-xl overflow-hidden bg-[#F3F3F3] elevation-lg mt-2">
      {image ? (
        <Image
          source={{ uri: image }}
          className="w-full h-20"
        />
      ) : (
        <View className='w-full flex items-center h-20 justify-center bg-white'>
          <MaterialIcons name="hide-image" size={24} color={color} />
        </View>
      )}
       

      <View className="px-2 py-1">
        <Text className="text-base font-inter-semibold p-2">{title}</Text>

        <FlatList
          data={skills}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View className="bg-green rounded-xl py-1 px-3 mr-1 mb-1">
              <Text className='font-inter-regular text-base text-start color-white'>{item}</Text>
            </View>
          )}
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerClassName="flex flex-row items-center"
        />
      </View>
    </View>
  )
}