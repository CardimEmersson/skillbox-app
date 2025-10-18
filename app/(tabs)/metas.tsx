import { ListCard } from "@/components/Metas/ListCard";
import { HeaderList } from "@/components/ui/HeaderList";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, RefreshControl, SafeAreaView, View } from "react-native";

const metas = [
  {
    id: '1',
    name: 'Meta 1',
    subtitle: 'Até 30 de setembro'
  },
  {
    id: '2',
    name: 'Meta 2',
    subtitle: 'Concluido'
  },
  {
    id: '3',
    name: 'Meta 3',
    subtitle: 'Em aberto'
  },
];

export default function Metas() {
   const router = useRouter();
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
            router.push('/cadastroMeta');
          }}
          title="Metas"
        />
        <FlatList
          data={metas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListCard
              name={item.name}
              subtitle={item.subtitle}
              percentual={50}
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