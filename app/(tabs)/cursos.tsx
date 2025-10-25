import { ListCard } from "@/components/Cursos/ListCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { HeaderList } from "@/components/ui/HeaderList";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, RefreshControl, SafeAreaView, View } from "react-native";

interface ICursoListItem {
  id: number;
  name: string;
  institution: string;
  workload: number;
}

const mockCursos: ICursoListItem[] = [
  {
    id: 1,
    name: 'Curso 1',
    institution: 'Alura',
    workload: 40
  },
  {
    id: 2,
    name: 'Curso 2',
    institution: 'Udemy',
    workload: 20
  },
  {
    id: 3,
    name: 'Curso 3',
    institution: 'IFBA',
    workload: 100
  },
];

export default function Cursos() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cursos, setCursos] = useState<ICursoListItem[]>(mockCursos);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className='w-full flex-1 pt-10 px-8 pb-8'>
        <HeaderList
          onPressAdd={() => {
            router.push('/cadastroCurso');
          }}
          title="Cursos"
        />
        <FlatList
          data={cursos}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={({ item }) => (
            <ListCard
              name={item.name}
              institution={item.institution}
              workload={item.workload}
              onPress={() => {
                //
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
        />
      </View>
    </SafeAreaView>
  )
}