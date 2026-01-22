import { ListCardPerfilSkeleton } from "@/components/Cursos/ListCardPerfilSkeleton";
import { ListCardProjetoPerfil } from "@/components/Projetos/ListCardProjetoPerfil";
import { ListCardProjetoPerfilSkeleton } from "@/components/Projetos/ListCardProjetoPerfilSkeleton";
import { ConfirmationModal, CustomButton } from "@/components/ui";
import { EmptyState } from "@/components/ui/EmptyState";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { SkillboxItem, SkillboxItemSkeleton, TypeColorsSkillbox } from "@/components/ui/SkillboxItem";
import { PerfilCompartilhavel } from "@/components/Usuarios/PerfilCompartilhavel";
import { PerfilCompartilhavelPdf } from "@/components/Usuarios/PerfilCompartilhavelPdf";
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
import { deleteUsuario, getUsuarioAuth } from "@/services/modules/usuarioService";
import { customToastError } from "@/utils/toast";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import { useFocusEffect, useRouter } from "expo-router";
import * as Sharing from 'expo-sharing';
import { useCallback, useContext, useMemo, useRef, useState } from "react";
import { Image, Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import ViewShot from "react-native-view-shot";

export const colorsSkillbox: TypeColorsSkillbox[] = ["green", "orange", "blue", "pink", "primary", "purple", "red"];

export default function Usuario() {
  const router = useRouter();
  const { userAuth, handleUserAuth, logout } = useContext(AuthContext);
  const [isExitModalVisible, setIsExitModalVisible] = useState(false);
  const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [usuario, setUsuario] = useState<{
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
  }>();
  const [isLoadingUsuario, setIsLoadingUsuario] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const [cursos, setCursos] = useState<IGetCurso[]>([]);
  const [projetos, setProjetos] = useState<IGetProjeto[]>([]);
  const [habilidades, setHabilidades] = useState<IGetHabilidade[]>([]);
  const [metas, setMetas] = useState<IGetMeta[]>([]);
  const viewShotRef = useRef<ViewShot>(null);
  const viewShotPdfRef = useRef<ViewShot>(null);
  const [showAllHabilidades, setShowAllHabilidades] = useState(false);
  const [showAllCursos] = useState(false);
  const [showAllProjetos] = useState(false);
  const [showAllMetas] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isLoadingShare, setIsLoadingShare] = useState(false);

  async function getUsuarioData() {
    setIsLoadingUsuario(true);
    try {
      const result = await getUsuarioAuth();

      if (result) {
        setUsuario({
          nome: `${result.nome} ${result.sobrenome ?? ""}`,
          bio: result.bio ?? "",
          avatar: result.avatar ?? "",
          email: result.email ?? "",
          telefone: result.telefone ?? "",
          localizacao: result.localizacao ?? "",
          linkedin: result.linkedin ?? "",
          github: result.github ?? "",
          website: result.site ?? "",
          objetivoProfissional: result.objetivo_profissional ?? "",
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

  async function handleShareImage() {
    setShowShareOptions(false);
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

  async function handleSharePdf() {
    setShowShareOptions(false);
    setIsLoadingShare(true);
    try {
      Toast.show({ type: 'info', text1: 'Gerando PDF', text2: 'Aguarde um momento...' });

      if (viewShotPdfRef.current?.capture) {
        const uriImg = await viewShotPdfRef.current.capture();

        const { width, height } = await new Promise<{ width: number; height: number }>((resolve, reject) => {
          Image.getSize(uriImg, (w, h) => resolve({ width: w, height: h }), (error) => reject(error));
        });

        const base64 = await FileSystem.readAsStringAsync(uriImg, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const html = `
          <html>
            <body style="margin: 0; padding: 0;">
              <img src="data:image/jpeg;base64,${base64}" style="width: 100%; height: 100%;" />
            </body>
          </html>
        `;

        const { uri } = await Print.printToFileAsync({ html, width, height });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
        }
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Erro ao gerar PDF', text2: error?.message ?? "Não foi possível gerar o PDF." });
    } finally {
      setIsLoadingShare(false);
    }
  }

  async function handleDeleteUsuario() {
    setIsDeleting(true);
    try {
      await deleteUsuario();
      Toast.show({
        type: 'success',
        text1: 'Sucesso!',
        text2: 'usuario excluído com sucesso!',
      });
      logout();
      setTimeout(() => router.push('/login'), 300);
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Erro ao excluir', text2: error?.message ?? "Tente novamente mais tarde." });
      customToastError({
        text1: 'Erro ao excluir',
        text2: error?.message ?? "Tente novamente mais tarde.",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteAccountModalVisible(false);
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

        <View className="w-full flex flex-row justify-between mt-10 z-50">
          <CustomButton
            title='Editar perfil'
            onPress={() => {
              router.push('/cadastroUsuario')
            }}
            className="flex-1 mt-auto mr-2"
          />
          <View className="flex-1 mt-auto relative">
            <CustomButton
              title='Compartilhar'
              onPress={() => setShowShareOptions(!showShareOptions)}
              className="w-full"
              colors={[...Colors.greenGradient] as [string, string, ...string[]]}
              rightIcon={
                <AntDesign name="sharealt" size={24} color="white" />
              }
              isLoading={isLoadingShare}
            />
            {showShareOptions && (
              <View className="absolute top-16 right-0 w-full bg-white rounded-lg shadow-black shadow-2xl border border-light-gray z-50 elevation-lg p-2">
                <CustomButton
                  title='Imagem'
                  onPress={handleShareImage}
                  className="w-full mb-1"
                  variant="outlined"
                  colors={[...Colors.greenGradient] as [string, string, ...string[]]}
                  finalColor={1}
                  rightIcon={
                    <FontAwesome5 name="image" size={20} color="#00B288" />
                  }
                />
                <CustomButton
                  title='PDF'
                  onPress={handleSharePdf}
                  className="w-full"
                  variant="outlined"
                  colors={[...Colors.greenGradient] as [string, string, ...string[]]}
                  finalColor={1}
                  rightIcon={
                    <FontAwesome5 name="file-pdf" size={20} color="#00B288" />
                  }
                />
              </View>
            )}
          </View>
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
          <View className="w-full mb-4">
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

        <View className="flex flex-row w-full mb-4">
          <View className="flex flex-1 mr-2">
            <Text className="text-3xl font-inter-bold">Cursos</Text>

            {isLoadingData ? (
              <>
                <ListCardProjetoPerfilSkeleton />
                <ListCardProjetoPerfilSkeleton />

                <ListCardProjetoPerfilSkeleton />
                <ListCardProjetoPerfilSkeleton />
              </>
            ) : (
              displayedCursos.map((item) => (
                <ListCardProjetoPerfil
                  key={item.id}
                  image={item.imagens?.[0]?.imagem_url ?? ""}
                  title={item.nome}
                  skills={item.habilidades?.map((item) => item.nome)}
                  description={`${item.plataforma_instituicao} - ${item.carga_horaria} horas`}
                />
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
                  description={item.descricao}
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
          <Text className="text-3xl font-inter-bold mb-2">Metas</Text>

          <View className="w-full flex flex-col flex-wrap justify-between gap-1">
            {isLoadingData ? (
              <>
                <ListCardPerfilSkeleton />
                <ListCardPerfilSkeleton />

                <ListCardPerfilSkeleton />
                <ListCardPerfilSkeleton />
              </>
            ) : (
              displayedMetas.map((item) => (
                <CustomButton
                  key={item.id}
                  title={item.nome}
                  onPress={() => {
                    //
                  }}
                  className="flex-1 w-full"
                  colors={[...Colors.pinkGradient] as [string, string, ...string[]]}
                />
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

        <View className="w-full mt-8 mb-2">
          <Pressable
            className="mx-auto flex-row items-center justify-center"
            onPress={() => setIsDeleteAccountModalVisible(true)}
          >
            <FontAwesome5 name="trash-alt" size={16} color="#ef4444" style={{ marginRight: 8 }} />
            <Text className="text-red-500 font-inter-bold text-lg underline">Excluir conta</Text>
          </Pressable>
        </View>
      </ScrollView>
      <ConfirmationModal
        isVisible={isExitModalVisible}
        onClose={() => setIsExitModalVisible(false)}
        onConfirm={async () => {
          setIsExitModalVisible(false);
          await AsyncStorage.removeItem("@SkillBox:user");
          handleUserAuth(null);
          router.push('/login');
        }}
        title="Confirmar saida"
        message="Tem certeza de que deseja sair?"
        confirmButtonText="Sim, Sair"
      />
      <ConfirmationModal
        isVisible={isDeleteAccountModalVisible}
        onClose={() => setIsDeleteAccountModalVisible(false)}
        onConfirm={handleDeleteUsuario}
        title="Excluir conta"
        message="Tem certeza de que deseja excluir sua conta? Todos os seus dados serão perdidos permanentemente. Esta ação não pode ser desfeita."
        confirmButtonText="Sim, Excluir"
        isConfirming={isDeleting}
      />
      <View style={{ position: 'absolute', left: -10000 }}>
        <ViewShot ref={viewShotRef} options={{ fileName: "meu-perfil-skillbox", format: "jpg", quality: 0.9 }}>
          <PerfilCompartilhavel
            usuario={usuario}
            habilidades={habilidades}
            cursos={cursos}
            projetos={projetos}
            metas={metas}
          />
        </ViewShot>
      </View>
      <View style={{ position: 'absolute', left: -20000 }}>
        <ViewShot ref={viewShotPdfRef} options={{ fileName: "meu-perfil-skillbox", format: "jpg", quality: 0.9 }}>
          <PerfilCompartilhavelPdf
            usuario={usuario}
            habilidades={habilidades}
            cursos={cursos}
            projetos={projetos}
            metas={metas}
          />
        </ViewShot>
      </View>
    </SafeAreaView>
  )
}