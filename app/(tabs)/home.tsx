import { HeaderProfile } from '@/components/Home/HeaderProfile';
import { SectionCaixaHabilidades } from '@/components/Home/SectionCaixaHabilidades';
import { SectionCategorias } from '@/components/Home/SectionCategorias';
import { SectionCursos } from '@/components/Home/SectionCursos';
import { AuthContext } from '@/contexts/authContext';
import { ICursosPopulares } from '@/interfaces/home';
import { getCursosPopulares, getDashboard } from '@/services/modules/homeService';
import { customToastError } from '@/utils/toast';
import { useFocusEffect } from 'expo-router';
import { useCallback, useContext, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View } from "react-native";

export type TypeCountData = {
  cursos: number;
  habilidades: number;
  metas: number;
  projetos: number;
}

export default function Home() {
  const { userAuth } = useContext(AuthContext);
  const scrollViewRef = useRef<ScrollView>(null);
  const [countData, setCountData] = useState<TypeCountData>({
    cursos: 0,
    habilidades: 0,
    metas: 0,
    projetos: 0,
  });
  const [cursosPopulares, setCursosPopulares] = useState<ICursosPopulares>();
  const [isLoadingCountData, setIsLoadingCountData] = useState(false);
  const [isLoadingCursos, setIsLoadingCursos] = useState(false);

  async function getCursosPopularesData() {
    setIsLoadingCursos(true);
    try {
      const result = await getCursosPopulares();

      if (result) {
        setCursosPopulares(result);
      }
    } catch (error: any) {
      customToastError({
        text2: error?.message ?? "Tente novamente mais tarde.",
        text1: "Erro no dashboard",
      });
    } finally {
      setIsLoadingCursos(false);
    }
  }

  async function getCountData() {
    setIsLoadingCountData(true);
    try {

      const result = await getDashboard();
      
      setCountData({
        cursos: result?.cursos ?? 0,
        habilidades: result?.habilidades ?? 0,
        metas: result?.metas ?? 0,
        projetos: result?.projetos ?? 0,
      });
    } catch (error: any) {
      customToastError({
        text2: error?.message ?? "Tente novamente mais tarde.",
        text1: "Erro no dashboard",
      });
    } finally {
      setIsLoadingCountData(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getCountData();
      getCursosPopularesData();

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
          <SectionCategorias className='mt-10' isLoading={isLoadingCursos} />
          <SectionCursos className='mt-2' isLoading={isLoadingCursos} cursosPopulares={cursosPopulares} />

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}