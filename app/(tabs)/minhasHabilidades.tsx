import { ListCard } from '@/components/MinhasHabilidades/ListCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { HeaderList } from '@/components/ui/HeaderList';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, SafeAreaView, View } from "react-native";

interface IHabilidadeListItem {
  id: number;
  name: string;
  nivel: string;
}

const mockHabilidades: IHabilidadeListItem[] = [
    {
      id: 1,
      name: 'Python',
      nivel: 'Intermediario',
    },
    {
      id: 2,
      name: 'React',
      nivel: 'Iniciante',
    },
    {
      id: 3,
      name: 'JavaScript',
      nivel: 'Avançado',
    },
    {
      id: 4,
      name: 'Python',
      nivel: 'Intermediario',
    },
    {
      id: 5,
      name: 'React',
      nivel: 'Iniciante',
    },
    {
      id: 6,
      name: 'JavaScript',
      nivel: 'Avançado',
    },
    {
      id: 7,
      name: 'Python',
      nivel: 'Intermediario',
    },
    {
      id: 8,
      name: 'React',
      nivel: 'Iniciante',
    },
    {
      id: 9,
      name: 'JavaScript',
      nivel: 'Avançado',
    },
  ];

export default function MinhasHabilidades() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [habilidades, setHabilidades] = useState<IHabilidadeListItem[]>(mockHabilidades);

  

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
            router.push('/cadastroHabilidade')
          }}
          title="Minhas habilidades"
        />
        <FlatList
          data={habilidades}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={({ item }) => (
            <ListCard
              name={item.name}
              nivel={item.nivel}
              onPress={() => {
                //
              }}
              percentual={50}
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
          
        />
      </View>
    </SafeAreaView>
  )
}