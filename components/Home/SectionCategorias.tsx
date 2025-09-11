import AntDesign from '@expo/vector-icons/AntDesign';
import { ScrollView, Text, View } from "react-native";

interface SectionCategoriasProps {
  className?: string;
}

export function SectionCategorias({className}: SectionCategoriasProps) {

  return (
    <View className={`w-full ${className}`}>
      <Text className='font-bold text-2xl color-text mb-2'>Categorias recomendadas</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className='mx-1'>
          <View className="w-16 h-16 bg-primary rounded-full items-center justify-center mb-1">
            <AntDesign name="mobile1" size={24} color="white" />
          </View>
          <Text className="text-center font-inter-regular color-text">Design</Text>
        </View>
        <View className='mx-1'>
          <View className="w-16 h-16 bg-primary rounded-full items-center justify-center mb-1">
            <AntDesign name="mobile1" size={24} color="white" />
          </View>
          <Text className="text-center font-inter-regular color-text">Design</Text>
        </View>
        <View className='mx-1'>
          <View className="w-16 h-16 bg-primary rounded-full items-center justify-center mb-1">
            <AntDesign name="mobile1" size={24} color="white" />
          </View>
          <Text className="text-center font-inter-regular color-text">Design</Text>
        </View>
        <View className='mx-1'>
          <View className="w-16 h-16 bg-primary rounded-full items-center justify-center mb-1">
            <AntDesign name="mobile1" size={24} color="white" />
          </View>
          <Text className="text-center font-inter-regular color-text">Design</Text>
        </View>
        <View className='mx-1'>
          <View className="w-16 h-16 bg-primary rounded-full items-center justify-center mb-1">
            <AntDesign name="mobile1" size={24} color="white" />
          </View>
          <Text className="text-center font-inter-regular color-text">Design</Text>
        </View>
        <View className='mx-1'>
          <View className="w-16 h-16 bg-primary rounded-full items-center justify-center mb-1">
            <AntDesign name="mobile1" size={24} color="white" />
          </View>
          <Text className="text-center font-inter-regular color-text">Design</Text>
        </View>
      </ScrollView>
    </View>
  )
}