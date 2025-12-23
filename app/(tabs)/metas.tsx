import { ListCard } from "@/components/Metas/ListCard";
import { ListCardSkeleton } from "@/components/MinhasHabilidades/ListCard.skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { HeaderList } from "@/components/ui/HeaderList";
import { getMetas } from "@/services/modules/metaService";
import { customToastError } from "@/utils/toast";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, RefreshControl, SafeAreaView, View } from "react-native";

interface IMetaListItem {
  id: number;
  name: string;
  subtitle: string;
  percentual: number;
}

function formatPrazoConclusao(prazo: string, status: string): string {
  try {
    const [year, month, day] = prazo.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    const formattedDate = new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);

    return status === 'concluído' ? `Concluído em ${formattedDate}` : `Até ${formattedDate}`;
  } catch (error) {
    return prazo;
  }
}

export default function Metas() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [metas, setMetas] = useState<IMetaListItem[]>([]);

  async function getMetasData() {
    setIsLoadingData(true);
    try {
      const result = await getMetas();

      const formatedItems: IMetaListItem[] = result?.data?.map((item) => {
        return {
          id: item.id,
          subtitle: formatPrazoConclusao(item.prazo_conclusao, item.status),
          name: item.nome,
          percentual: item.status === 'concluído' ? 100 : item.status === 'em andamento' ? 50 : 10,
        }
      }) ?? [];

      setMetas(formatedItems);
    } catch (error: any) {
      customToastError({
        text1: 'Erro na meta',
        text2: error?.message ?? "Tente novamente mais tarde.",
      });
    } finally {
      setIsLoadingData(false);
    }
  }

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await getMetasData();
    setIsRefreshing(false);
  }, []);

  useFocusEffect(useCallback(() => {
    getMetasData();
  }, []));

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className='w-full flex-1 pt-10 px-8 pb-8'>
        <HeaderList
          onPressAdd={() => {
            router.push('/cadastroMeta');
          }}
          title="Metas"
        />
        {isLoadingData ? (
          <>
            <ListCardSkeleton />
            <ListCardSkeleton />
            <ListCardSkeleton />
            <ListCardSkeleton />
          </>
        ) : <FlatList
          data={metas}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={({ item }) => (
            <ListCard
              name={item.name}
              subtitle={item.subtitle}
              percentual={item.percentual}
              onPress={() => {
                router.push({
                  pathname: '/cadastroMeta',
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
              icon="trophy-outline"
              title="Nenhuma meta cadastrada"
              message="Você ainda não adicionou nenhuma meta. Toque no botão '+' para começar!"
            />
          }
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
        />
        }
      </View>
    </SafeAreaView>
  )
}