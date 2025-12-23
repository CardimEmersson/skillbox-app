import { domain } from '@/components/Home/SectionCursos';
import { CursoItem, CursoItemSkeleton } from '@/components/ui/CursoItem';
import { EmptyState } from '@/components/ui/EmptyState';
import { HeaderList } from '@/components/ui/HeaderList';
import { TypeCursosRecomendados } from '@/interfaces/home';
import { getCursosByCategoria } from '@/services/modules/homeService';
import { customToastError } from '@/utils/toast';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';

export default function RecomendacoesCursos() {
  const router = useRouter();
  const { category, id } = useLocalSearchParams<{ category: string, id: string }>();
  const scrollViewRef = useRef<ScrollView>(null);
  const [cursosCategoria1, setCursosCategoria1] = useState<TypeCursosRecomendados[]>([]);
  const [cursosCategoria2, setCursosCategoria2] = useState<TypeCursosRecomendados[]>([]);
  const [isLoadingCursos, setIsLoadingCursos] = useState(false);

  async function getCursosByCategoriaData(idCategoria: number) {
    setIsLoadingCursos(true);
    try {
      const result = await getCursosByCategoria(idCategoria);

      if (result) {
        const items = result?.unit?.items || [];
        const half = Math.ceil(items.length / 2);

        setCursosCategoria1(items.slice(0, half));
        setCursosCategoria2(items.slice(half));
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

  useFocusEffect(
    useCallback(() => {
      id && getCursosByCategoriaData(Number(id));

      return () => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: false });
      };
    }, [id])
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="w-full flex-1 pt-10 px-8 pb-8">
        <HeaderList title={`Cursos de ${category}`} onBack={() => router.back()} disabledAdd />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }} ref={scrollViewRef}>
        {(isLoadingCursos || (cursosCategoria1?.length ?? 0) > 0 || (cursosCategoria2?.length ?? 0) > 0) && (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 5, paddingTop: 20 }}>
              {isLoadingCursos ? (
                <>
                  <CursoItemSkeleton />
                  <CursoItemSkeleton />
                  <CursoItemSkeleton />
                </>
              ) : (
                cursosCategoria1?.map((curso, index) => (
                  <CursoItem key={index}
                    author={curso?.visible_instructors?.map((instructor) => instructor.name).join(", ")}
                    description={curso.headline ?? ""}
                    image={curso?.image_750x422 ?? ""}
                    title={curso?.title}
                    url={`${domain}${curso?.url}`}
                  />
                ))
              )}
            </ScrollView>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 5, paddingTop: 20 }}>
              {isLoadingCursos ? (
                <>
                  <CursoItemSkeleton />
                  <CursoItemSkeleton />
                  <CursoItemSkeleton />
                </>
              ) : (
                cursosCategoria2?.map((curso, index) => (
                  <CursoItem key={index}
                    author={curso?.visible_instructors?.map((instructor) => instructor.name).join(", ")}
                    description={curso.headline ?? ""}
                    image={curso?.image_750x422 ?? ""}
                    title={curso?.title}
                    url={`${domain}${curso?.url}`}
                  />
                ))
              )}
            </ScrollView>
          </>
        )}
        {!isLoadingCursos && (!cursosCategoria1?.length || !cursosCategoria2?.length) && (
          <EmptyState
            icon="school-outline"
            title="Nenhum curso encontrado"
            message="Ainda não temos recomendações para esta categoria. Explore outras áreas!"
          />
        )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
