import { HeaderList } from "@/components/ui";
import { EmptyState } from "@/components/ui/EmptyState";
import { NotificationItem } from "@/components/ui/NotificationItem";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, SafeAreaView, View } from "react-native";

interface INotificacaoListItem {
  id: string;
  icon: string;
  title: string;
  isRead: boolean;
}

const mockNotificacoes: INotificacaoListItem[] = [
  {
    id: '1',
    icon: 'star-outline',
    title: 'Sua habilidade em Python foi avaliada como "Avançado"!',
    isRead: false,
  },
  {
    id: '2',
    icon: 'trophy-outline',
    title: 'Você completou a meta "Aprender React Native". Parabéns!',
    isRead: false,
  },
  {
    id: '3',
    icon: 'document-text-outline',
    title: 'Novo projeto "App de E-commerce" adicionado ao seu portfólio.',
    isRead: true,
  },
];

export default function Notificacoes() {
  const router = useRouter();
  const [notificacoes] = useState(mockNotificacoes);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View className="flex-1 w-full pt-10 px-8 pb-8">
          <HeaderList
            onPressAdd={() => {
              //
            }}
            title="Notificações"
            onBack={() => {
              router.push('/home')
            }}
            disabledAdd
          />
          

          {notificacoes.length === 0 ? (
            <EmptyState
              icon="notifications-off-outline"
              title="Nenhuma notificação"
              message="Você não tem nenhuma notificação no momento. Volte mais tarde!"
            />
          ) : (
            <FlatList
              data={notificacoes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <NotificationItem icon={item.icon as any} title={item.title} isRead={item.isRead} />}
              showsVerticalScrollIndicator={false}
              contentContainerClassName="pt-6"
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}