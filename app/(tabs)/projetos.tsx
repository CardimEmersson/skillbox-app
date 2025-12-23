import { ListCardSkeleton } from "@/components/MinhasHabilidades/ListCard.skeleton";
import { ListCard } from "@/components/Projetos/ListCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { HeaderList } from "@/components/ui/HeaderList";
import { getProjetos } from "@/services/modules/projetoService";
import { customToastError } from "@/utils/toast";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, RefreshControl, SafeAreaView, View } from "react-native";

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
  const [projetos, setProjetos] = useState<IProjetoListItem[]>([]);

  async function getProjetosData() {
    setIsLoadingData(true);
    try {
      const result = await getProjetos();

      const formatedItems: IProjetoListItem[] = result?.data?.map((item) => {
        return {
          id: item.id,
          name: item.nome,
          description: item.descricao,
          habilidades: item.habilidades?.map((item) => item.nome) ?? []
        }
      }) ?? [];

      setProjetos(formatedItems);
    } catch (error: any) {
      customToastError({
        text1: 'Erro no projeto',
        text2: error?.message ?? "Tente novamente mais tarde.",
      });
    } finally {
      setIsLoadingData(false);
    }
  }

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await getProjetosData();
    setIsRefreshing(false);
  }, []);

  useFocusEffect(useCallback(() => {
    getProjetosData();
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
        />}
      </View>
    </SafeAreaView>
  )
}