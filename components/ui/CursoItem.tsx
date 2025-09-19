import { Dimensions, Image, Text, View } from "react-native";

const { width: screenWidth } = Dimensions.get("window");
const cardWidth = screenWidth * (1.5 / 3);

interface CursoItemProps {
  image: string;
  title: string;
  description: string;
  author: string;
}

export function CursoItem({image, title, description, author}: CursoItemProps) {
  return (
    <View style={{ width: cardWidth }} className='mx-1'>
      <View className="shadow-2xl bg-white rounded-xl">
        <Image
          style={{
            width: "100%",
            height: 140,
            objectFit: "cover",
          }}
          source={{ uri: image }}
          className="rounded-xl"
        />
      </View>
      <View className="flex mt-2">
        <Text className="font-inter-bold color-text text-lg">{title}</Text>
        <Text className="font-inter-regular color-gray text-xs mb-2">{author}</Text>
        <Text className="font-inter-regular color-black text-sm" numberOfLines={4}>{description}</Text>
      </View>
    </View>
  )
}