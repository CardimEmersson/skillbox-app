import { CursoItem } from '@/components/ui/CursoItem';
import { EmptyState } from '@/components/ui/EmptyState';
import { HeaderList } from '@/components/ui/HeaderList';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, View } from 'react-native';

interface Curso {
  title: string;
  author: string;
  description: string;
  image: string;
}

const cursosRecomendados: { [key: string]: Curso[] } = {
  Design: [
    {
      title: 'UI/UX Design Essencial',
      author: 'Leandro Rezende',
      description: 'Fundamentos de UI/UX para criar interfaces incríveis.',
      image: 'https://picsum.photos/seed/uidesign/600/400'
    },
  ],
  Code: [
    {
      title: 'Curso de React Native',
      author: 'John Doe',
      description: 'Aprenda a criar aplicativos para iOS e Android com React Native.',
      image: 'https://picsum.photos/seed/react/600/400'
    },
    {
      title: 'Curso de TypeScript',
      author: 'Jane Smith',
      description: 'Domine o TypeScript e adicione tipagem estática aos seus projetos.',
      image: 'https://picsum.photos/seed/typescript/600/400'
    },
  ],
  // Adicione outras categorias aqui...
};

export default function RecomendacoesCursos() {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category: string }>();
  const cursos = category ? cursosRecomendados[category] || [] : [];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="w-full flex-1 pt-10 px-8 pb-8">
        <HeaderList title={`Cursos de ${category}`} onBack={() => router.back()} disabledAdd />

        {cursos.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 5, paddingTop: 20 }}>
            {cursos.map((curso) => (
              <CursoItem key={curso.title} {...curso} />
            ))}
          </ScrollView>
        ) : (
          <EmptyState
            icon="school-outline"
            title="Nenhum curso encontrado"
            message="Ainda não temos recomendações para esta categoria. Explore outras áreas!"
          />
        )}
      </View>
    </SafeAreaView>
  );
}
