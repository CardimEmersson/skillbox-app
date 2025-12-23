import { Colors } from "@/constants/Colors";
import { useState } from "react";
import { Dimensions, Image, Linking, Pressable, Text, View } from "react-native";
import { ConfirmationModal } from "./ConfirmationModal";

const { width: screenWidth } = Dimensions.get("window");
const cardWidth = screenWidth * (1.5 / 3);

interface CursoItemProps {
  image: string;
  title: string;
  description: string;
  author: string;
  url: string;
}

export function CursoItem({ image, title, description, author, url }: CursoItemProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <Pressable onPress={() => setIsModalVisible(true)} style={{ width: cardWidth }} className='mx-1'>
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
      </Pressable>
      <ConfirmationModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={() => {
          setIsModalVisible(false);
          Linking.openURL(url);
        }}
        title="Ir para o curso"
        message="Deseja ser redirecionado para a página do curso?"
        confirmButtonText="Sim"
        colors={[...Colors.greenGradient] as [string, string, ...string[]]}
      />
    </>
  )
}

export function CursoItemSkeleton() {
  return (
    <View style={{ width: cardWidth }} className='mx-1'>
      <View className="shadow-2xl bg-white rounded-xl">
        <View className="w-full rounded-xl h-40 bg-zinc-300" />
      </View>
      <View className="flex mt-2">
        <View className="w-full h-5 bg-zinc-300" />
        <View className="w-full h-2 bg-zinc-300 mt-1" />
        <View className="w-full h-4 bg-zinc-300 mt-1" />
      </View>
    </View>
  )
}
