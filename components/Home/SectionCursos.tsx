import { ScrollView, Text, View } from "react-native";
import { CursoItem } from "../ui/CursoItem";

interface SectionCursosProps {
  className?: string;
}

const cursos = [
  {
    title: "Curso de React Native",
    author: "John Doe",
    description: "Aprenda a criar aplicativos para iOS e Android com React Native.",
    image: "https://picsum.photos/seed/react/600/400",
  },
  {
    title: "Curso de TypeScript",
    author: "Jane Smith",
    description: "Domine o TypeScript e adicione tipagem estática aos seus projetos JavaScript.",
    image: "https://picsum.photos/seed/typescript/600/400",
  },
  {
    title: "Curso de GraphQL",
    author: "Peter Jones",
    description: "Aprenda a construir APIs eficientes e flexíveis com GraphQL.",
    image: "https://picsum.photos/seed/graphql/600/400",
  },
];

export function SectionCursos({ className }: SectionCursosProps) {
  return (
    <View className={`w-full ${className}`}>
      <Text className='font-bold text-2xl color-text mb-2'>Cursos populares</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 5 }}>
        {cursos.map((curso) => (
          <CursoItem
            key={curso.title}
            author={curso.author}
            description={curso.description}
            image={curso.image}
            title={curso.title}
          />
        ))}
      </ScrollView>
    </View>
  )
}