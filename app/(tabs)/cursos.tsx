import { ListCard } from "@/components/Cursos/ListCard";
import { ListCardSkeleton } from "@/components/MinhasHabilidades/ListCard.skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { HeaderList } from "@/components/ui/HeaderList";
import { getCursos } from "@/services/modules/cursoService";
import { customToastError } from "@/utils/toast";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, SafeAreaView, View } from "react-native";

interface ICursoListItem {
  id: number;
  name: string;
  institution: string;
  workload: string;
  percentual: number;
}

export default function Cursos() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [cursos, setCursos] = useState<ICursoListItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  async function getCursosData(pageToLoad = 1, isRefresh = false) {
    if (isRefresh) {
      setIsLoadingData(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const result = await getCursos({
        page: pageToLoad,
        limit: 10
      });

      const formatedItems: ICursoListItem[] = result?.data?.map((item) => {
        return {
          id: item.id,
          institution: item.plataforma_instituicao,
          workload: item.carga_horaria,
          name: item.nome,
          percentual: item.em_andamento ? 50 : 100,
        }
      }) ?? [];
      
      if (isRefresh) {
        setCursos(formatedItems);
        setPage(1);
      } else {
        setCursos((prev) => [...prev, ...formatedItems]);
        setPage(pageToLoad);
      }
      
      setHasMore(formatedItems.length >= 10);
    } catch (error: any) {
      customToastError({
        text1: 'Erro no curso',
        text2: error?.message ?? "Tente novamente mais tarde.",
      });
    } finally {
      setIsLoadingData(false);
      setIsLoadingMore(false);
    }
  }

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await getCursosData(1, true);
    setIsRefreshing(false);
  }, []);

  const handleLoadMore = () => {
    if (!isLoadingData && !isLoadingMore && hasMore) {
      getCursosData(page + 1, false);
    }
  };

  useFocusEffect(useCallback(() => {
    getCursosData(1, true);
  }, []));

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className='w-full flex-1 pt-10 px-8 pb-8'>
        <HeaderList
          onPressAdd={() => {
            router.push('/cadastroCurso');
          }}
          title="Cursos"
        />
        {isLoadingData ? (
          <>
            <ListCardSkeleton />
            <ListCardSkeleton />
            <ListCardSkeleton />
            <ListCardSkeleton />
          </>
        ) : <FlatList
          data={cursos}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={({ item }) => (
            <ListCard
              name={item.name}
              institution={item.institution}
              workload={Number(item.workload)}
              onPress={() => {
                router.push({
                  pathname: '/cadastroCurso',
                  params: { id: item.id },
                });
              }}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="flex-grow"
          contentContainerStyle={{ paddingBottom: 50 }}
          ListEmptyComponent={
            <EmptyState
              icon="school-outline"
              title="Nenhum curso cadastrado"
              message="Você ainda não adicionou nenhum curso. Toque no botão '+' para começar!"
            />
          }
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={isLoadingMore ? <View className="py-4"><ActivityIndicator size="small" color="#00B288" /></View> : null}
        />}
      </View>
    </SafeAreaView>
  )
}