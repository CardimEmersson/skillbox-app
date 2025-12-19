import { HeaderProfile } from '@/components/Home/HeaderProfile';
import { SectionCaixaHabilidades } from '@/components/Home/SectionCaixaHabilidades';
import { SectionCategorias } from '@/components/Home/SectionCategorias';
import { SectionCursos } from '@/components/Home/SectionCursos';
import { AuthContext } from '@/comtexts/authContext';
import { useFocusEffect } from 'expo-router';
import { useCallback, useContext, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import Toast from 'react-native-toast-message';

export type TypeCountData = {
  cursos: number;
  habilidades: number;
  metas: number;
  projetos: number;
}

export default function Home() {
  const {userAuth} = useContext(AuthContext);
  const scrollViewRef = useRef<ScrollView>(null);
  const [countData, setCountData] = useState<TypeCountData>({
    cursos: 0,
    habilidades: 0,
    metas: 0,
    projetos: 0,
  });
  const [isLoadingCountData, setIsLoadingCountData] = useState(false);

  async function getCountData() {
    setIsLoadingCountData(true);
    try {
      // const [cursos, habilidades, metas, projetos] = await Promise.all([
      //   getCursos(userAuth?.id ?? ""),
      //   getHabilidades(userAuth?.id ?? ""),
      //   getMetas(userAuth?.id ?? ""),
      //   getProjetos(userAuth?.id ?? "")
      // ]);

      // setCountData({
      //   cursos: cursos?.length ?? 0,
      //   habilidades: habilidades?.length ?? 0,
      //   metas: metas?.length ?? 0,
      //   projetos: projetos?.length ?? 0,
      // });
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Erro no projeto', text2: error?.message ?? "Tente novamente mais tarde." });
    } finally {
      setIsLoadingCountData(false);
    }
  }

  useFocusEffect(
      useCallback(() => {  
        getCountData();
  
        return () => {
          scrollViewRef.current?.scrollTo({ y: 0, animated: false });
        };
      }, [])
    );

  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="flex-grow bg-white"
        automaticallyAdjustKeyboardInsets
      >
        <View className='w-full flex pt-10 px-8 pb-8'>
          <HeaderProfile />
          <Text className="text-3xl font-inter-regular color-text">Olá, <Text className="font-bold">{`${userAuth?.nome ?? ""}!`}</Text></Text>

          <SectionCaixaHabilidades className='mt-10' countData={countData} isLoading={isLoadingCountData} />
          <SectionCategorias className='mt-10' />
          <SectionCursos className='mt-10' />

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}