import { FlatList, Image, Text, View } from "react-native";

interface ListCardProjetoPerfilProps {
  title: string;
  description: string;
  image: string;
  skills: string[];
}

export function ListCardProjetoPerfil({ title, image, skills, description }: ListCardProjetoPerfilProps) {
  return (
    <View className="rounded-xl overflow-hidden bg-[#F3F3F3] elevation-lg mt-2">
      {Boolean(image) && (
        <Image
          source={{ uri: image }}
          className="w-full h-20"
        />
      )}       

      <View className="px-2 py-1">
        <Text className="text-xl font-inter-semibold px-2 pt-2">{title}</Text>
        <Text className="text-sm font-inter-regular px-2 pb-2" numberOfLines={2}>{description}</Text>

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