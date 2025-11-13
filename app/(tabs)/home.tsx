import { HeaderProfile } from '@/components/Home/HeaderProfile';
import { SectionCaixaHabilidades } from '@/components/Home/SectionCaixaHabilidades';
import { SectionCategorias } from '@/components/Home/SectionCategorias';
import { SectionCursos } from '@/components/Home/SectionCursos';
import { AuthContext } from '@/comtexts/authContext';
import { useContext } from 'react';
import { SafeAreaView, ScrollView, Text, View } from "react-native";

export default function Home() {
  const {userAuth} = useContext(AuthContext);

  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="flex-grow bg-white"
        automaticallyAdjustKeyboardInsets
      >
        <View className='w-full flex pt-10 px-8 pb-8'>
          <HeaderProfile />
          <Text className="text-3xl font-inter-regular color-text">Olá, <Text className="font-bold">{`${userAuth?.nome ?? ""}!`}</Text></Text>

          <SectionCaixaHabilidades className='mt-10' />
          <SectionCategorias className='mt-10' />
          <SectionCursos className='mt-10' />

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}