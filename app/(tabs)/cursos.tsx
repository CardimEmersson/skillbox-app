import { ListCard } from "@/components/Cursos/ListCard";
import { ListCardSkeleton } from "@/components/MinhasHabilidades/ListCard.skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { HeaderList } from "@/components/ui/HeaderList";
import { AuthContext } from "@/comtexts/authContext";
import { getCursos } from "@/services/modules/cursoService";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useContext, useState } from "react";
import { FlatList, RefreshControl, SafeAreaView, View } from "react-native";
import Toast from "react-native-toast-message";

interface ICursoListItem {
  id: string;
  name: string;
  institution: string;
  workload: string;
  percentual: number;
}

export default function Cursos() {
  const router = useRouter();
  const { userAuth } = useContext(AuthContext);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [cursos, setCursos] = useState<ICursoListItem[]>([]);

  async function getCursosData() {
    setIsLoadingData(true);
    try {
      const result = await getCursos(userAuth?.id ?? "");

      const formatedItems: ICursoListItem[] = result?.map((item) => {
        return {
          id: item.id,
          institution: item.plataformaInstituicao,
          workload: item.cargaHoraria,
          name: item.nome,
          percentual: item.emAndamento ? 50 : 100,
        }
      }) ?? [];

      setCursos(formatedItems);
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Erro no curso', text2: error?.message ?? "Tente novamente mais tarde." });
    } finally {
      setIsLoadingData(false);
    }
  }

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await getCursosData();
    setIsRefreshing(false);
  }, []);

  useFocusEffect(useCallback(() => {
    getCursosData();
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
        />}
      </View>
    </SafeAreaView>
  )
}