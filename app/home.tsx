import { SectionCaixaHabilidades } from '@/components/Home/SectionCaixaHabilidades';
import { SectionCategorias } from '@/components/Home/SectionCategorias';
import { sizes } from '@/constants/Sizes';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, SafeAreaView, ScrollView, Text, View } from "react-native";

export default function Home() {

  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="flex-grow bg-white"
        automaticallyAdjustKeyboardInsets
      >
        <View className='w-full flex pt-10 px-8 pb-8'>
          <View className="w-full flex-row justify-between items-center mb-5">
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
              className="w-16 h-16 rounded-full border-4 border-bege"
            />
            <View className='relative'>
              <Ionicons name="notifications-outline" size={sizes.icons.xl} color="black" />
              <View className='w-5 h-5 bg-primary absolute rounded-full items-center justify-center -right-0'>
                <Text className='color-white font-bold text-sm'>3</Text>
              </View>
            </View>
          </View>
          <Text className="text-3xl font-inter-regular color-text">Olá, <Text className="font-bold">Maria!</Text></Text>

          <SectionCaixaHabilidades className='mt-10' />
          <SectionCategorias className='mt-10' />

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}