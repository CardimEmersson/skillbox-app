import { UserAuthType } from "@/comtexts/authContext";
import { IGetCurso } from "@/interfaces/cadastroCurso";
import { IGetHabilidade } from "@/interfaces/cadastroHabilidade";
import { IGetProjeto } from "@/interfaces/cadastroProjeto";
import { FontAwesome5 } from "@expo/vector-icons";
import { Image, Text, View } from "react-native";
import { ListCardPerfil } from "../Cursos/ListCardPerfil";
import { ListCardProjetoPerfil } from "../Projetos/ListCardProjetoPerfil";
import { SkillboxItem, TypeColorsSkillbox } from "../ui/SkillboxItem";

interface PerfilCompartilhavelProps {
  userAuth: UserAuthType | null;
  cursos: IGetCurso[];
  projetos: IGetProjeto[];
  habilidades: IGetHabilidade[];
}

const colorsSkillbox: TypeColorsSkillbox[] = ["green", "orange", "blue", "pink", "primary", "purple", "red"];

export function PerfilCompartilhavel({ userAuth, cursos, projetos, habilidades }: PerfilCompartilhavelProps) {
  return (
    <View className="bg-white p-6" style={{ width: 400 }}>
      <View className="flex-row items-center mb-6">
        {userAuth?.imagem ? (
          <Image source={{ uri: userAuth.imagem }} className="w-20 h-20 rounded-full mr-4" />
        ) : (
          <View className="w-20 h-20 rounded-full mr-4 bg-gray-200 items-center justify-center">
            <FontAwesome5 name="user-alt" size={32} color="#A0A0A0" />
          </View>
        )}
        <View className="flex-1">
          <Text className="text-2xl font-inter-bold">{userAuth?.nome}</Text>
          <Text className="text-base font-inter-light text-gray-600" numberOfLines={2}>{userAuth?.bio}</Text>
        </View>
      </View>

      <Text className="text-xl font-inter-bold mb-3">Skillbox</Text>
      <View className="flex-row flex-wrap justify-between mb-4">
        {habilidades.slice(0, 6).map((item, index) => (
          <SkillboxItem
            key={item.id}
            title={item.proficiencia}
            value={item.nome}
            bgColor={colorsSkillbox[index % colorsSkillbox.length]}
          />
        ))}
      </View>

      <View className="flex-row w-full">
        <View className="flex-1 mr-3">
          <Text className="text-xl font-inter-bold mb-2">Cursos</Text>
          {cursos.slice(0, 3).map(curso => (
            <ListCardPerfil key={curso.id} institution={curso.plataformaInstituicao}
              name={curso.nome} />
          ))}
        </View>

        <View className="flex-1">
          <Text className="text-xl font-inter-bold mb-2">Projetos</Text>
          {projetos.slice(0, 3).map(projeto => (
            <ListCardProjetoPerfil
              key={projeto.id}
              image={projeto.imagens[0] ?? ""}
              title={projeto.nome}
              skills={projeto.habilidadesUtilizadas?.map((item) => item.nome)}
            />
          ))}
        </View>
      </View>

      <View className="flex-row items-center justify-center mt-6 pt-4 border-t border-gray-200">
        <Image
            style={{
              width: 40,
              height: 60,
              objectFit: "contain",
            }}
            source={require('@/assets/images/skillbox.png')}
          />
      </View>
    </View>
  )
}