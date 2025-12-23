import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { CategoryItem, CategoryItemSkeleton } from '../ui/CategoryItem';

interface SectionCategoriasProps {
  className?: string;
  isLoading: boolean;
}

const categories = [
  { title: 'Desenvolvimento', id: 288, className: 'bg-primary', icon: <MaterialIcons name="code" size={24} color="white" /> },
  { title: 'Négocios', id: 268, className: 'bg-pink', icon: <FontAwesome5 name="handshake" size={24} color="white" /> },
  { title: 'Finanças', id: 328, className: 'bg-orange', icon: <MaterialIcons name="attach-money" size={24} color="white" /> },
  { title: 'TI & Software', id: 294, className: 'bg-green', icon: <MaterialIcons name="computer" size={24} color="white" /> },
  { title: 'Produtividade', id: 292, className: 'bg-primary', icon: <MaterialIcons name="insights" size={24} color="white" /> },
  { title: 'Desenvolvimento pessoal', id: 296, className: 'bg-pink', icon: <MaterialIcons name="track-changes" size={24} color="white" /> },
  { title: 'Design', id: 269, className: 'bg-orange', icon: <MaterialIcons name="design-services" size={24} color="white" /> },
  { title: 'Marketing', id: 290, className: 'bg-green', icon: <MaterialIcons name="ads-click" size={24} color="white" /> },
  { title: 'Estilo de vida', id: 274, className: 'bg-primary', icon: <MaterialIcons name="favorite" size={24} color="white" /> },
  { title: 'Foto e video', id: 273, className: 'bg-pink', icon: <MaterialIcons name="camera-alt" size={24} color="white" /> },
  { title: 'Saúde & Fitness', id: 276, className: 'bg-orange', icon: <MaterialIcons name="fitness-center" size={24} color="white" /> },
  { title: 'Música', id: 278, className: 'bg-green', icon: <MaterialIcons name="queue-music" size={24} color="white" /> },
  { title: 'Ensino & vida acadêmica', id: 278, className: 'bg-primary', icon: <MaterialIcons name="menu-book" size={24} color="white" /> },
];

export function SectionCategorias({ className, isLoading }: SectionCategoriasProps) {
  const router = useRouter();

  const handleCategoryPress = (categoryTitle: string, id: number) => {
    router.push({
      pathname: '/recomendacoesCursos',
      params: { category: categoryTitle, id: id },
    });
  };

  return (
    <View className={`w-full ${className}`}>
      <Text className='font-bold text-2xl color-text mb-2'>Categorias recomendadas</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 5 }}>
        {isLoading ? (
          <>
            <CategoryItemSkeleton />
            <CategoryItemSkeleton />
            <CategoryItemSkeleton />
            <CategoryItemSkeleton />
            <CategoryItemSkeleton />
          </>
        ) : (
          categories.map((category) => (
            <CategoryItem key={category.title} title={category.title} className={category.className} icon={category.icon} onPress={() => handleCategoryPress(category.title, category.id)} />
          ))

        )}

      </ScrollView>
    </View>
  )
}