import { ICursosPopulares } from "@/interfaces/home";
import { ScrollView, Text, View } from "react-native";
import { CursoItem, CursoItemSkeleton } from "../ui/CursoItem";

export const domain = "https://www.udemy.com"

interface SectionCursosProps {
  className?: string;
  isLoading: boolean;
  cursosPopulares?: ICursosPopulares;
}

// const cursos = [
//   {
//     title: "Curso de React Native",
//     author: "John Doe",
//     description: "Aprenda a criar aplicativos para iOS e Android com React Native.",
//     image: "https://picsum.photos/seed/react/600/400",
//   },
//   {
//     title: "Curso de TypeScript",
//     author: "Jane Smith",
//     description: "Domine o TypeScript e adicione tipagem estática aos seus projetos JavaScript.",
//     image: "https://picsum.photos/seed/typescript/600/400",
//   },
//   {
//     title: "Curso de GraphQL",
//     author: "Peter Jones",
//     description: "Aprenda a construir APIs eficientes e flexíveis com GraphQL.",
//     image: "https://picsum.photos/seed/graphql/600/400",
//   },
// ];

export function SectionCursos({ className, isLoading, cursosPopulares }: SectionCursosProps) {
  return (
    <View className={`w-full ${className}`}>
      <Text className='font-bold text-2xl color-text mb-2'>Cursos populares</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 5 }}>
        {isLoading ? (
          <>
            <CursoItemSkeleton />
            <CursoItemSkeleton />
            <CursoItemSkeleton />
          </>
        ) : (
          cursosPopulares?.unit?.items.map((curso, index) => (
            <CursoItem
              key={index}
              author={curso?.visible_instructors?.map((instructor) => instructor.name).join(", ")}
              description={curso.headline ?? ""}
              image={curso?.image_750x422 ?? ""}
              title={curso?.title}
              url={`${domain}${curso?.url}`}
            />
          ))
        )}
      </ScrollView>
    </View>
  )
}