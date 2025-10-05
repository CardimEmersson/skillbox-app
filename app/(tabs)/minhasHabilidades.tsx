import { ListCard } from '@/components/MinhasHabilidades/ListCard';
import { HeaderList } from '@/components/ui/HeaderList';
import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, SafeAreaView, View } from "react-native";


export default function MinhasHabilidades() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const habilidades = [
    {
      id: '1',
      name: 'Python',
      nivel: 'Intermediario',
    },
    {
      id: '2',
      name: 'React',
      nivel: 'Iniciante',
    },
    {
      id: '3',
      name: 'JavaScript',
      nivel: 'Avançado',
    },
    {
      id: '4',
      name: 'Python',
      nivel: 'Intermediario',
    },
    {
      id: '5',
      name: 'React',
      nivel: 'Iniciante',
    },
    {
      id: '6',
      name: 'JavaScript',
      nivel: 'Avançado',
    },
    {
      id: '7',
      name: 'Python',
      nivel: 'Intermediario',
    },
    {
      id: '8',
      name: 'React',
      nivel: 'Iniciante',
    },
    {
      id: '9',
      name: 'JavaScript',
      nivel: 'Avançado',
    },
  ]

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
          title="Minhas habilidades"
        />
        <FlatList
          data={habilidades}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListCard
              name={item.name}
              nivel={item.nivel}
              onPress={() => {
                //
              }}
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
