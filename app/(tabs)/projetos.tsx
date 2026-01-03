import { ListCardSkeleton } from "@/components/MinhasHabilidades/ListCard.skeleton";
import { ListCard } from "@/components/Projetos/ListCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { HeaderList } from "@/components/ui/HeaderList";
import { getProjetos } from "@/services/modules/projetoService";
import { customToastError } from "@/utils/toast";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, SafeAreaView, View } from "react-native";

interface IProjetoListItem {
  id: number;
  name: string;
  description: string;
  habilidades: string[];
}

export default function Projetos() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [projetos, setProjetos] = useState<IProjetoListItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  async function getProjetosData(pageToLoad = 1, isRefresh = false) {
    if (isRefresh) {
      setIsLoadingData(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const result = await getProjetos({
        page: pageToLoad,
        limit: 10
      });

      const formatedItems: IProjetoListItem[] = result?.data?.map((item) => {
        return {
          id: item.id,
          name: item.nome,
          description: item.descricao,
          habilidades: item.habilidades?.map((item) => item.nome) ?? []
        }
      }) ?? [];
      
      if (isRefresh) {
        setProjetos(formatedItems);
        setPage(1);
      } else {
        setProjetos((prev) => [...prev, ...formatedItems]);
        setPage(pageToLoad);
      }
      
      setHasMore(formatedItems.length >= 10);
    } catch (error: any) {
      customToastError({
        text1: 'Erro no projeto',
        text2: error?.message ?? "Tente novamente mais tarde.",
      });
    } finally {
      setIsLoadingData(false);
      setIsLoadingMore(false);
    }
  }

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await getProjetosData(1, true);
    setIsRefreshing(false);
  }, []);

  const handleLoadMore = () => {
    if (!isLoadingData && !isLoadingMore && hasMore) {
      getProjetosData(page + 1, false);
    }
  };

  useFocusEffect(useCallback(() => {
    getProjetosData(1, true);
  }, []));

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className='w-full flex-1 pt-10 px-8 pb-8'>
        <HeaderList
          onPressAdd={() => {
            router.push('/cadastroProjeto');
          }}
          title="Projetos"
        />
        {isLoadingData ? (
          <>
            <ListCardSkeleton />
            <ListCardSkeleton />
            <ListCardSkeleton />
            <ListCardSkeleton />
          </>
        ) : <FlatList
          data={projetos}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={({ item }) => (
            <ListCard
              name={item.name}
              description={item.description}
              onPress={() => {
                router.push({
                  pathname: '/cadastroProjeto',
                  params: { id: item.id },
                });
              }}
              habilidades={item.habilidades}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="flex-grow"
          contentContainerStyle={{ paddingBottom: 50 }}
          ListEmptyComponent={
            <EmptyState
              icon="briefcase-outline"
              title="Nenhum projeto cadastrado"
              message="Você ainda não adicionou nenhum projeto. Toque no botão '+' para começar!"
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