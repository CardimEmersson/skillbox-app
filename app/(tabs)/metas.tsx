import { ListCard } from "@/components/Metas/ListCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { HeaderList } from "@/components/ui/HeaderList";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, RefreshControl, SafeAreaView, View } from "react-native";

interface IMetaListItem {
  id: number;
  name: string;
  subtitle: string;
}

const mockMetas: IMetaListItem[] = [
  {
    id: 1,
    name: 'Meta 1',
    subtitle: 'Até 30 de setembro'
  },
  {
    id: 2,
    name: 'Meta 2',
    subtitle: 'Concluido'
  },
  {
    id: 3,
    name: 'Meta 3',
    subtitle: 'Em aberto'
  },
];

export default function Metas() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [metas, setMetas] = useState<IMetaListItem[]>(mockMetas);

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
            router.push('/cadastroMeta');
          }}
          title="Metas"
        />
        <FlatList
          data={metas}
          keyExtractor={(item) => item.id?.toString()}
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
      </View>
    </SafeAreaView>
  )
}