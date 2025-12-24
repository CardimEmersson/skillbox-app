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

interface PerfilCompartilhavelPdfProps {
  usuario?: {
    nome: string;
    bio: string;
    avatar: string;
    email: string;
    telefone: string;
    localizacao: string;
    linkedin: string;
    github: string;
    website: string;
    objetivoProfissional: string;
  };
  cursos: IGetCurso[];
  projetos: IGetProjeto[];
  habilidades: IGetHabilidade[];
  metas: IGetMeta[];
}

const colorsSkillbox: TypeColorsSkillbox[] = ["green", "orange", "blue", "pink", "primary", "purple", "red"];

export function PerfilCompartilhavelPdf({ usuario, cursos, projetos, habilidades, metas }: PerfilCompartilhavelPdfProps) {
  return (
    <View className="bg-white flex flex-row" style={{ width: 595, minHeight: 842 }}>
      <View className="flex items-center p-4 h-full bg-[#3874EA] w-1/3">
        {usuario?.avatar ? (
          <Image source={{ uri: usuario.avatar ?? "" }} className="w-28 h-28 rounded-full mb-4" />
        ) : (
          <View className="w-28 h-28 rounded-full mb-4 bg-gray-200 items-center justify-center">
            <FontAwesome5 name="user-alt" size={32} color="#A0A0A0" />
          </View>
        )}
        <View className="w-full">
          <View className="flex-row items-center mb-2">
            <FontAwesome5 name="envelope" size={12} color="white" style={{ width: 16, textAlign: 'center' }} />
            <Text className="text-white text-[10px] ml-2 flex-1" numberOfLines={1}>{usuario?.email}</Text>
          </View>
          {usuario?.telefone && <View className="flex-row items-center mb-2">
            <FontAwesome5 name="phone" size={12} color="white" style={{ width: 16, textAlign: 'center' }} />
            <Text className="text-white text-[10px] ml-2 flex-1" numberOfLines={1}>{usuario?.telefone}</Text>
          </View>}
          {usuario?.localizacao && <View className="flex-row items-center mb-2">
            <FontAwesome5 name="map-marker-alt" size={12} color="white" style={{ width: 16, textAlign: 'center' }} />
            <Text className="text-white text-[10px] ml-2 flex-1" numberOfLines={1}>{usuario?.localizacao}</Text>
          </View>}
          {usuario?.linkedin && <View className="flex-row items-center mb-2">
            <FontAwesome5 name="linkedin" size={12} color="white" style={{ width: 16, textAlign: 'center' }} />
            <Text className="text-white text-[10px] ml-2 flex-1" numberOfLines={1}>{usuario?.linkedin}</Text>
          </View>}
          {usuario?.github && <View className="flex-row items-center mb-2">
            <FontAwesome5 name="github" size={12} color="white" style={{ width: 16, textAlign: 'center' }} />
            <Text className="text-white text-[10px] ml-2 flex-1" numberOfLines={1}>{usuario?.github}</Text>
          </View>}
          {usuario?.website && <View className="flex-row items-center mb-2">
            <FontAwesome5 name="globe" size={12} color="white" style={{ width: 16, textAlign: 'center' }} />
            <Text className="text-white text-[10px] ml-2 flex-1" numberOfLines={1}>{usuario?.website}</Text>
          </View>}
        </View>
      </View>
      <View className="flex relative w-2/3 p-4">
        <Text className="text-4xl font-inter-bold color-text mb-6">{usuario?.nome}</Text>
        <Image
          style={{
            width: 40,
            height: 60,
            objectFit: "contain",
            position: "absolute",
            right: 5,
            top: 5,
          }}
          source={require('@/assets/images/skillbox.png')}
        />

        <Text className="text-2xl font-inter-bold color-text">Biografia</Text>
        <Text className="text-base font-inter-light text-gray-600 mb-6">{usuario?.bio}</Text>

        <Text className="text-2xl font-inter-bold color-text">Objetivo profissional</Text>
        <Text className="text-base font-inter-light text-gray-600 mb-6">{usuario?.objetivoProfissional}</Text>

        <Text className="text-xl font-inter-bold mb-3 color-text">Skillbox</Text>
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
                skills={[]}
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
    </View>
  )
}