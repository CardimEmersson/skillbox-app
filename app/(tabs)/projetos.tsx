import { ListCard } from "@/components/Projetos/ListCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { HeaderList } from "@/components/ui/HeaderList";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, RefreshControl, SafeAreaView, View } from "react-native";

interface IProjetoListItem {
  id: number;
  name: string;
  description: string;
  habilidades: string[];
}

const mockProjetos: IProjetoListItem[] = [
  {
    id: 1,
    name: 'Projeto 1',
    description: 'Desenvolvi um app de controle financeiro pessoal com foco em simplicidade e visualização clara dos gastos.',
    habilidades: ["Lógica de programação", "UI Design", "Python"]
  },
  {
    id: 2,
    name: 'Projeto 2',
    description: 'Descrição do projeto 2',
    habilidades: ["Lógica de programação", "UI Design", "Python"]
  },
  {
    id: 3,
    name: 'Projeto 3',
    description: 'Descrição do projeto 3',
    habilidades: ["Lógica de programação", "UI Design", "Python"]
  },
];

export default function Projetos() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [projetos, setProjetos] = useState<IProjetoListItem[]>(mockProjetos);

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
            router.push('/cadastroProjeto');
          }}
          title="Projetos"
        />
        <FlatList
          data={projetos}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={({ item }) => (
            <ListCard
              name={item.name}
              description={item.description}
              onPress={() => {
                //
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
        />
      </View>
    </SafeAreaView>
  )
}