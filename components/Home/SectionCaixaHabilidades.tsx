import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { CardCaixaHabilidades } from "../CardCaixaHabilidades";

interface SectionCaixaHabilidadesProps {
  className?: string;
}

export function SectionCaixaHabilidades({ className }: SectionCaixaHabilidadesProps) {
  const router = useRouter();

  return (
    <View className={`w-full ${className}`}>
      <Text className='font-bold text-2xl color-text mb-2'>Caixa de habilidades</Text>

      <View className="flex-row w-full">
        <View className="w-1/2 pr-1">
          <CardCaixaHabilidades
            colors={[...Colors.greenGradient] as [string, string, ...string[]]}
            label="Habilidades"
            value="12"
            classNameWrapper="mb-2"
            classNameContent="h-44"
            onPress={() => router.push('/minhasHabilidades')}
          />
          <CardCaixaHabilidades
            colors={[...Colors.pinkGradient] as [string, string, ...string[]]}
            label="Metas"
            value="12"
            classNameContent="h-32"
            onPress={() => router.push('/metas')}
          />
        </View>

        <View className="w-1/2 pl-1">
          <CardCaixaHabilidades
            colors={[...Colors.orangeGradient] as [string, string, ...string[]]}
            label="Cursos feitos"
            value="12"
            classNameWrapper="mb-2"
            classNameContent="h-32"
            onPress={() => router.push('/cursos')}
          />
          <CardCaixaHabilidades
            colors={[...Colors.blueGradient] as [string, string, ...string[]]}
            label="Projetos"
            value="12"
            classNameContent="h-44"
            onPress={() => router.push('/projetos')}
          />
        </View>
      </View>
    </View>
  )
}