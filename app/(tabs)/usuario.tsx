import { ListCardPerfil } from "@/components/Cursos/ListCardPerfil";
import { ListCardPerfilSkeleton } from "@/components/Cursos/ListCardPerfilSkeleton";
import { ListCardPreview } from "@/components/Metas/ListCardPreview";
import { ListCardProjetoPerfil } from "@/components/Projetos/ListCardProjetoPerfil";
import { ListCardProjetoPerfilSkeleton } from "@/components/Projetos/ListCardProjetoPerfilSkeleton";
import { ConfirmationModal, CustomButton } from "@/components/ui";
import { EmptyState } from "@/components/ui/EmptyState";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { SkillboxItem, SkillboxItemSkeleton, TypeColorsSkillbox } from "@/components/ui/SkillboxItem";
import { PerfilCompartilhavel } from "@/components/Usuarios/PerfilCompartilhavel";
import { Colors } from "@/constants/Colors";
import { AuthContext } from "@/contexts/authContext";
import { IParamsPaginate } from "@/interfaces/apiRequest";
import { IGetCurso } from "@/interfaces/cadastroCurso";
import { IGetHabilidade } from "@/interfaces/cadastroHabilidade";
import { IGetMeta } from "@/interfaces/cadastroMeta";
import { IGetProjeto } from "@/interfaces/cadastroProjeto";
import { getCursos } from "@/services/modules/cursoService";
import { getHabilidades } from "@/services/modules/habilidadeService";
import { getMetas } from "@/services/modules/metaService";
import { getProjetos } from "@/services/modules/projetoService";
import { getUsuarioAuth } from "@/services/modules/usuarioService";
import { customToastError } from "@/utils/toast";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import * as Sharing from 'expo-sharing';
import { useCallback, useContext, useMemo, useRef, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import ViewShot from "react-native-view-shot";

export const colorsSkillbox: TypeColorsSkillbox[] = ["green", "orange", "blue", "pink", "primary", "purple", "red"];

export default function Usuario() {
  const router = useRouter();
  const { userAuth, handleUserAuth } = useContext(AuthContext);
  const [isExitModalVisible, setIsExitModalVisible] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [usuario, setUsuario] = useState<{
    nome: string;
    bio: string;
    avatar: string;
  }>();
  const [isLoadingUsuario, setIsLoadingUsuario] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const [cursos, setCursos] = useState<IGetCurso[]>([]);
  const [projetos, setProjetos] = useState<IGetProjeto[]>([]);
  const [habilidades, setHabilidades] = useState<IGetHabilidade[]>([]);
  const [metas, setMetas] = useState<IGetMeta[]>([]);
  const viewShotRef = useRef<ViewShot>(null);
  const [showAllHabilidades, setShowAllHabilidades] = useState(false);
  const [showAllCursos] = useState(false);
  const [showAllProjetos] = useState(false);
  const [showAllMetas] = useState(false);

  async function getUsuarioData() {
    setIsLoadingUsuario(true);
    try {
      const result = await getUsuarioAuth();

      if (result) {
        setUsuario({
          nome: result.nome ?? "",
          bio: result.bio ?? "",
          avatar: result.avatar ?? ""
        });
      }
    } catch (error: any) {
      customToastError({
        text1: 'Erro na busca do usuario',
        text2: error?.message ?? "Tente novamente mais tarde.",
      });
    } finally {
      setIsLoadingUsuario(false);
    }
  }

  async function getInfoData() {
    setIsLoadingData(true);
    try {
      const params: IParamsPaginate = {
        limit: 10
      };

      const [cursosData, projetosData, habilidadesData, metasData] = await Promise.all([getCursos(params), getProjetos(params), getHabilidades(), getMetas(params)]);

      setCursos(cursosData?.data ?? []);
      setProjetos(projetosData?.data ?? []);
      setHabilidades(habilidadesData?.data ?? []);
      setMetas(metasData?.data ?? []);
    } catch (error: any) {
      customToastError({
        text1: 'Erro na busca das informações',
        text2: error?.message ?? "Tente novamente mais tarde.",
      });
    } finally {
      setIsLoadingData(false);
    }
  }

  async function handleShare() {
    try {
      if (viewShotRef.current?.capture) {
        const localUri = await viewShotRef.current.capture();
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(localUri);
        }
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Erro ao compartilhar', text2: error?.message ?? "Não foi possível compartilhar o perfil." });
    }
  }

  const displayedHabilidades = useMemo(() => {
    return showAllHabilidades ? habilidades : (habilidades ?? []).slice(0, 6);
  }, [showAllHabilidades, habilidades]);

  const displayedCursos = useMemo(() => {
    return showAllCursos ? cursos : (cursos ?? []).slice(0, 3);
  }, [showAllCursos, cursos]);

  const displayedProjetos = useMemo(() => {
    return showAllProjetos ? projetos : (projetos ?? []).slice(0, 3);
  }, [showAllProjetos, projetos]);

  const displayedMetas = useMemo(() => {
    return showAllMetas ? metas : (metas ?? []).slice(0, 4);
  }, [showAllMetas, metas]);

  useFocusEffect(
    useCallback(() => {
      getInfoData();
      getUsuarioData();

      return () => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: false });
      };
    }, [userAuth])
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="flex-grow w-full flex pt-10 px-8 pb-8 mt-2"
        automaticallyAdjustKeyboardInsets
        ref={scrollViewRef}
      >
        <View className="flex items-center ">
          <View className="w-full flex flex-row justify-between">
            <Pressable className="opacity-0">
              <FontAwesome5 name="angle-left" size={32} color="black" />
            </Pressable>

            <Text className="text-2xl font-inter-bold mb-4 ml-2">Perfil</Text>

            <Pressable onPress={() => {
              setIsExitModalVisible(true);
            }}>
              <AntDesign name="logout" size={25} />
            </Pressable>
          </View>
          <ImageUploader image={usuario?.avatar ?? ""} setImage={() => {
            //
          }} disabled />
          {isLoadingUsuario ? (
            <>
              <View className='h-8 w-1/2 bg-zinc-300 rounded' />
              <View className='h-5 w-[30%] bg-zinc-300 rounded mt-1' />
              <View className='h-5 w-[40%] bg-zinc-300 rounded mt-1' />
            </>
          ) : (
            <>
              <Text className="text-2xl font-inter-bold">{usuario?.nome ?? ""}</Text>
              <Text className="text-xl font-inter-light text-center">{usuario?.bio ?? ""}</Text>
            </>
          )}
        </View>

        <View className="w-full flex flex-row justify-between mt-10">
          <CustomButton
            title='Editar perfil'
            onPress={() => {
              router.push('/cadastroUsuario')
            }}
            className="flex-1 mt-auto mr-2"
          />
          <CustomButton
            title='Compartilhar'
            onPress={handleShare}
            className="flex-1 mt-auto"
            colors={[...Colors.greenGradient] as [string, string, ...string[]]}
          />
        </View>

        <Text className="text-3xl font-inter-bold my-8">Skillbox</Text>

        <View className="w-full flex flex-row flex-wrap justify-between mb-4">
          {isLoadingData ? (
            <>
              <SkillboxItemSkeleton />
              <SkillboxItemSkeleton />
              <SkillboxItemSkeleton />
              <SkillboxItemSkeleton />
              <SkillboxItemSkeleton />
              <SkillboxItemSkeleton />
            </>
          ) : (
            displayedHabilidades.map((item, index) => (
              <SkillboxItem
                key={item.id}
                title={item.nome}
                value={item.nome}
                bgColor={colorsSkillbox[index % colorsSkillbox.length]}
              />
            ))
          )}

          {!isLoadingData && habilidades.length === 0 && (
            <EmptyState
              icon="ribbon-outline"
              title="Nenhuma habilidade cadastrada"
              message="Você ainda não adicionou nenhuma habilidade"
            />
          )}
        </View>
        {habilidades.length > 6 && (
          <View className="w-full">
            <CustomButton
              title={showAllHabilidades ? 'Esconder habilidades' : 'Carregar mais'}
              onPress={() => {
                setShowAllHabilidades(!showAllHabilidades);
              }}
              className="flex-1"
              variant="outlined"
            />
          </View>
        )}

        <View className="flex flex-row w-full">
          <View className="flex flex-1 mr-2">
            <Text className="text-3xl font-inter-bold">Cursos</Text>

            {isLoadingData ? (
              <>
                <ListCardPerfilSkeleton />
                <ListCardPerfilSkeleton />

                <ListCardPerfilSkeleton />
                <ListCardPerfilSkeleton />
              </>
            ) : (
              displayedCursos.map((item) => (
                <ListCardPerfil key={item.id} institution={item.plataforma_instituicao}
                  name={item.nome} />
              ))
            )}

            {!isLoadingData && cursos.length === 0 && (
              <EmptyState
                icon="school-outline"
                title="Nenhum curso cadastrado"
                message="Você ainda não adicionou nenhum curso."
              />
            )}
          </View>
          <View className="flex flex-1">
            <Text className="text-3xl font-inter-bold">Projetos</Text>

            {isLoadingData ? (
              <>
                <ListCardProjetoPerfilSkeleton />
                <ListCardProjetoPerfilSkeleton />

                <ListCardProjetoPerfilSkeleton />
                <ListCardProjetoPerfilSkeleton />
              </>
            ) : (
              displayedProjetos.map((item) => (
                <ListCardProjetoPerfil
                  key={item.id}
                  image={item.imagens?.[0]?.imagem_url ?? ""}
                  title={item.nome}
                  skills={item.habilidades?.map((item) => item.nome)}
                />
              ))
            )}

            {!isLoadingData && projetos.length === 0 && (
              <EmptyState
                icon="briefcase-outline"
                title="Nenhum projeto cadastrado"
                message="Você ainda não adicionou nenhum projeto"
              />
            )}
          </View>
        </View>
        <View className="flex w-full">
          <Text className="text-3xl font-inter-bold">Metas</Text>

          <View className="w-full flex flex-row flex-wrap justify-between">
            {isLoadingData ? (
              <>
                <ListCardPerfilSkeleton />
                <ListCardPerfilSkeleton />

                <ListCardPerfilSkeleton />
                <ListCardPerfilSkeleton />
              </>
            ) : (
              displayedMetas.map((item) => (
                <ListCardPreview key={item.id} name={item.nome} />
              ))
            )}

            {!isLoadingData && metas.length === 0 && (
              <EmptyState
                icon="trophy-outline"
                title="Nenhuma meta cadastrada"
                message="Você ainda não adicionou nenhuma meta"
              />
            )}
          </View>
        </View>

      </ScrollView>
      <ConfirmationModal
        isVisible={isExitModalVisible}
        onClose={() => setIsExitModalVisible(false)}
        onConfirm={() => {
          setIsExitModalVisible(false);
          handleUserAuth(null);
          router.push('/login');
        }}
        title="Confirmar saida"
        message="Tem certeza de que deseja sair?"
        confirmButtonText="Sim, Sair"
      />
      <View style={{ position: 'absolute', left: -10000 }}>
        <ViewShot ref={viewShotRef} options={{ fileName: "meu-perfil-skillbox", format: "jpg", quality: 0.9 }}>
          <PerfilCompartilhavel
            usuario={usuario}
            habilidades={habilidades}
            cursos={cursos}
            projetos={projetos} />
        </ViewShot>
      </View>
    </SafeAreaView>
  )
}