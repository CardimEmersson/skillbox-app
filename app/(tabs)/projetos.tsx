import { ListCard } from "@/components/Projetos/ListCard";
import { HeaderList } from "@/components/ui/HeaderList";
import { useCallback, useState } from "react";
import { FlatList, RefreshControl, SafeAreaView, View } from "react-native";

const projetos = [
  {
    id: '1',
    name: 'Projeto 1',
    description: 'Desenvolvi um app de controle financeiro pessoal com foco em simplicidade e visualização clara dos gastos.',
    habilidades: ["Lógica de programação", "UI Design", "Python"]
  },
  {
    id: '2',
    name: 'Projeto 2',
    description: 'Descrição do projeto 2',
    habilidades: ["Lógica de programação", "UI Design", "Python"]
  },
  {
    id: '3',
    name: 'Projeto 3',
    description: 'Descrição do projeto 3',
    habilidades: ["Lógica de programação", "UI Design", "Python"]
  },
];


export default function Projetos() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className='w-full flex pt-10 px-8 pb-8'>
        <HeaderList
          onPressAdd={() => {
            //
          }}
          title="Projetos"
        />
        <FlatList
          data={projetos}
          keyExtractor={(item) => item.id}
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
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
        />
      </View>
    </SafeAreaView>
  )
}