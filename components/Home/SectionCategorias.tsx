import AntDesign from '@expo/vector-icons/AntDesign';
import { ScrollView, Text, View } from "react-native";
import AppleIcon from '../../assets/icons/apple.svg';
import { CategoryItem } from '../ui/CategoryItem';

interface SectionCategoriasProps {
  className?: string;
}

const categories = [
  { title: 'Design', className: 'bg-primary', icon: <AntDesign name="mobile1" size={24} color="white" /> },
  { title: 'Apple', className: 'bg-pink', icon: <AppleIcon width={24} height={24} color="#fff" /> },
  { title: 'Code', className: 'bg-orange', icon: <AntDesign name="codesquare" size={24} color="white" /> },
  { title: 'Health', className: 'bg-green', icon: <AntDesign name="hearto" size={24} color="white" /> },
  { title: 'Music', className: 'bg-primary', icon: <AntDesign name="customerservice" size={24} color="white" /> },
  { title: 'Photo', className: 'bg-pink', icon: <AntDesign name="camerao" size={24} color="white" /> },
  { title: 'Games', className: 'bg-orange', icon: <AntDesign name="Trophy" size={24} color="white" /> },
];

export function SectionCategorias({className}: SectionCategoriasProps) {

  return (
    <View className={`w-full ${className}`}>
      <Text className='font-bold text-2xl color-text mb-2'>Categorias recomendadas</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 5 }}>
        {categories.map((category, index) => (
          <CategoryItem key={index} title={category.title} className={category.className} icon={category.icon} />
        ))}
      </ScrollView>
    </View>
  )
}