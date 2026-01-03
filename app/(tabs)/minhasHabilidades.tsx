import { ListCard } from '@/components/MinhasHabilidades/ListCard';
import { ListCardSkeleton } from '@/components/MinhasHabilidades/ListCard.skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { HeaderList } from '@/components/ui/HeaderList';
import { getHabilidades } from '@/services/modules/habilidadeService';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, SafeAreaView, View } from "react-native";
import Toast from 'react-native-toast-message';

interface IHabilidadeListItem {
  id: number | string;
  name: string;
  nivel: string;
  imagem?: string | null;
  percentual: number;
}

const percentualHabilidade = {
  "iniciante": 10,
  "intermediário": 50,
  "avançado": 100,
}

export default function MinhasHabilidades() {
  const router = useRouter();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [habilidades, setHabilidades] = useState<IHabilidadeListItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  async function getHabilidadesData(pageToLoad = 1, isRefresh = false) {
    if (isRefresh) {
      setIsLoadingData(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const result = await getHabilidades({
        page: pageToLoad,
        limit: 10
      });

      if (result) {
        const formatedItems: IHabilidadeListItem[] = result?.data?.map((item) => {
          return {
            id: item.id,
            name: item.nome,
            nivel: item.nivel,
            percentual: percentualHabilidade[item.nivel],
            imagem: item.icone ?? null,
          }
        }) ?? [];
  
        if (isRefresh) {
          setHabilidades(formatedItems);
          setPage(1);
        } else {
          setHabilidades((prev) => [...prev, ...formatedItems]);
          setPage(pageToLoad);
        }
        
        setHasMore(formatedItems.length >= 10);
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Erro na habilidade', text2: error?.message ?? "Tente novamente mais tarde." });
    } finally {
      setIsLoadingData(false);
      setIsLoadingMore(false);
    }
  }

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await getHabilidadesData(1, true);
    setIsRefreshing(false);
  }, []);

  const handleLoadMore = () => {
    if (!isLoadingData && !isLoadingMore && hasMore) {
      getHabilidadesData(page + 1, false);
    }
  };

  useFocusEffect(useCallback(() => {
    getHabilidadesData(1, true);
  }, []));

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className='w-full flex-1 pt-10 px-8 pb-8'>
        <HeaderList
          onPressAdd={() => {
            router.push('/cadastroHabilidade')
          }}
          title="Minhas habilidades"
        />
        {isLoadingData ? (
          <>
            <ListCardSkeleton />
            <ListCardSkeleton />
            <ListCardSkeleton />
            <ListCardSkeleton />
          </>
        ) : <FlatList
          data={habilidades}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={({ item }) => (
            <ListCard
              name={item.name}
              nivel={item.nivel}
              onPress={() => {
                router.push({
                  pathname: '/cadastroHabilidade',
                  params: { id: item.id },
                });
              }}
              percentual={item.percentual}
              image={item.imagem}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="flex-grow"
          contentContainerStyle={{ paddingBottom: 50 }}
          ListEmptyComponent={
            <EmptyState
              icon="ribbon-outline"
              title="Nenhuma habilidade cadastrada"
              message="Você ainda não adicionou nenhuma habilidade. Toque no botão '+' para começar!"
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