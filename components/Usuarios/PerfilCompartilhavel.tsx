import { Colors } from "@/constants/Colors";
import { IGetCurso } from "@/interfaces/cadastroCurso";
import { IGetHabilidade } from "@/interfaces/cadastroHabilidade";
import { IGetMeta } from "@/interfaces/cadastroMeta";
import { IGetProjeto } from "@/interfaces/cadastroProjeto";
import { FontAwesome5 } from "@expo/vector-icons";
import { Image, Text, View } from "react-native";
import { ListCardProjetoPerfil } from "../Projetos/ListCardProjetoPerfil";
import { CustomButton } from "../ui";
import { SkillboxItem, TypeColorsSkillbox } from "../ui/SkillboxItem";

interface PerfilCompartilhavelProps {
  usuario?: {
    nome: string;
    bio: string;
    avatar: string;
  };
  cursos: IGetCurso[];
  projetos: IGetProjeto[];
  habilidades: IGetHabilidade[];
  metas: IGetMeta[];
}

const colorsSkillbox: TypeColorsSkillbox[] = ["green", "orange", "blue", "pink", "primary", "purple", "red"];

export function PerfilCompartilhavel({ usuario, cursos, projetos, habilidades, metas }: PerfilCompartilhavelProps) {
  return (
    <View className="bg-white p-6" style={{ width: 400 }}>
      <View className="flex-row items-center mb-6 relative">
        {usuario?.avatar ? (
          <Image source={{ uri: usuario.avatar ?? "" }} className="w-20 h-20 rounded-full mr-4" />
        ) : (
          <View className="w-20 h-20 rounded-full mr-4 bg-gray-200 items-center justify-center">
            <FontAwesome5 name="user-alt" size={32} color="#A0A0A0" />
          </View>
        )}
        <View className="flex-1 mr-12">
          <Text className="text-2xl font-inter-bold">{usuario?.nome}</Text>
          <Text className="text-base font-inter-light text-gray-600">{usuario?.bio}</Text>
        </View>

        <Image
          style={{
            width: 40,
            height: 60,
            objectFit: "contain",
            position: "absolute",
            right: 0,
            top: 0,
          }}
          source={require('@/assets/images/skillbox.png')}
        />
      </View>

      <Text className="text-xl font-inter-bold mb-3">Skillbox</Text>
      <View className="flex-row flex-wrap justify-between mb-4">
        {habilidades.slice(0, 6).map((item, index) => (
          <SkillboxItem
            key={item.id}
            title={item.nivel}
            value={item.nome}
            bgColor={colorsSkillbox[index % colorsSkillbox.length]}
          />
        ))}
      </View>

      <View className="flex-row w-full">
        <View className="flex-1 mr-3">
          <Text className="text-xl font-inter-bold mb-2">Cursos</Text>
          {cursos.slice(0, 3).map(curso => (
            <ListCardProjetoPerfil
              key={curso.id}
              image={curso.imagens?.[0]?.imagem_url ?? ""}
              title={curso.nome}
              skills={curso.habilidades?.map((item) => item.nome)}
              description={`${curso.plataforma_instituicao} - ${curso.carga_horaria} horas`}
            />
          ))}
        </View>

        <View className="flex-1">
          <Text className="text-xl font-inter-bold mb-2">Projetos</Text>
          {projetos.slice(0, 3).map(projeto => (
            <ListCardProjetoPerfil
              key={projeto.id}
              image={projeto.imagens?.[0]?.imagem_url ?? ""}
              title={projeto.nome}
              skills={projeto.habilidades?.map((item) => item.nome)}
              description={projeto.descricao}
            />
          ))}
        </View>
      </View>
      <View className="flex w-full mb-2">
        <Text className="text-xl font-inter-bold mb-2">Metas</Text>

        <View className="w-full flex flex-row flex-wrap justify-between gap-1">
          {metas.map((item) => (
            <CustomButton
              key={item.id}
              title={item.nome}
              onPress={() => {
                //
              }}
              className="flex-1"
              colors={[...Colors.pinkGradient] as [string, string, ...string[]]}
            />
          ))}
        </View>
      </View>
    </View>
  )
}