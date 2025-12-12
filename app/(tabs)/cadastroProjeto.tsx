import { ControlledDateRangeInput } from "@/components/ControlledDateRangeInput";
import { ControlledInput } from "@/components/ControlledInput";
import { ControlledSelect } from "@/components/ControlledSelect";
import { ThemedText } from "@/components/ThemedText";
import { BadgeClose, BadgetCloseGradient, ConfirmationModal, CustomButton, HeaderList, MultiImageUploader, SelectOption } from "@/components/ui";
import { AuthContext } from "@/comtexts/authContext";
import { Colors } from "@/constants/Colors";
import { ProjetoSchema } from "@/data/shemas/projetoSchema";
import { CadastroProjetoDataForm, IPostProjeto } from "@/interfaces/cadastroProjeto";
import { getHabilidades } from "@/services/modules/habilidadeService";
import { deleteProjeto, getProjetoById, postProjeto, putProjeto } from "@/services/modules/projetoService";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useContext, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, View } from "react-native";
import Toast from "react-native-toast-message";
import { SelectionOptionCursoProjeto } from "./cadastroHabilidade";

const optionsTipoProjeto: SelectOption[] = [
  { label: 'Aprendizado', value: 'aprendizado' },
  { label: 'Pessoal', value: 'pessoal' },
  { label: 'Profissional', value: 'profissional' },
  { label: 'Colaborativo', value: 'colaborativo' },
  { label: 'Academico', value: 'academico' },
  { label: 'Criativo', value: 'criativo' },
  { label: 'Open source', value: 'open_source' },
];

const optionsCursos: SelectionOptionCursoProjeto[] = [
  { label: 'Curso 01', value: 1, tipo: 'curso' },
  { label: 'Curso 02', value: 2, tipo: 'curso' },
  { label: 'Curso 03', value: 3, tipo: 'curso' },
  { label: 'Curso 04', value: 4, tipo: 'curso' },
];

const defaultValuesCadatroProjeto: CadastroProjetoDataForm = {
  nome: "",
  periodo: "",
  habilidadeSelecionada: undefined,
  habilidadesUtilizadas: [],
  tipoProjeto: "",
  descricao: "",
  cursos: [],
  link: "",
  imagens: [],
  cursoSelecionado: undefined,
}

export default function CadastroProjeto() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingHabilidades, setIsLoadingHabilidades] = useState(false);
  const [optionsHabilidades, setOptionsHabilidades] = useState<SelectOption[]>([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const { userAuth } = useContext(AuthContext);
  const scrollViewRef = useRef<ScrollView>(null);

  const {
    control,
    watch,
    getValues,
    setValue,
    handleSubmit,
    reset,
  } = useForm<CadastroProjetoDataForm>({
    defaultValues: defaultValuesCadatroProjeto,
    resolver: yupResolver(ProjetoSchema) as any,
  });

  function onAddHabilidade() {
    if (watch().habilidadeSelecionada) {
      const habilidadeSelecionada: string = getValues().habilidadeSelecionada ?? "";
      const findedHabilidade = getValues().habilidadesUtilizadas.find((habilidade) => habilidade === watch().habilidadeSelecionada);

      if (!findedHabilidade) {
        setValue("habilidadesUtilizadas", [...getValues().habilidadesUtilizadas, habilidadeSelecionada], {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    }
    setValue("habilidadeSelecionada", undefined, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function onRemoveHabilidade(habilidade: string) {
    const filteredCategorias = getValues().habilidadesUtilizadas.filter((item) => item !== habilidade);
    setValue("habilidadesUtilizadas", filteredCategorias, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function onAddCursos() {
    if (watch().cursoSelecionado) {
      const cursoSelecionado: number = getValues().cursoSelecionado ?? 0;
      const findedItem = optionsCursos.find((item) => item.value === cursoSelecionado);

      if (findedItem) {
        const findedCurso = getValues().cursos.find((curso) => curso.id === findedItem?.value);

        if (!findedCurso) {
          setValue("cursos", [...getValues().cursos, {
            id: findedItem.value,
            descricao: findedItem.label,
            tipo: findedItem.tipo
          }], {
            shouldDirty: true,
            shouldValidate: true,
          });
        }
      }

    }
    setValue("cursoSelecionado", undefined, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function onRemoveCursos(curso: number) {
    const filteredCursos = getValues().cursos.filter((item) => item.id !== curso);
    setValue("cursos", filteredCursos, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  async function handleDeleteProjeto() {
    if (!params.id) return;
    setIsSubmitting(true);
    try {
      await deleteProjeto(params.id);
      Toast.show({
        type: 'success',
        text1: 'Sucesso!',
        text2: 'projeto excluído com sucesso!',
      });
      setTimeout(() => router.push('/projetos'), 300);
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Erro ao excluir', text2: error?.message ?? "Tente novamente mais tarde." });
    } finally {
      setIsSubmitting(false);
      setIsDeleteModalVisible(false);
    }
  }

  async function handleSubmitProjeto(data: CadastroProjetoDataForm) {
    setIsSubmitting(true);
    try {
      const habilidadesUtilizadas: {
        nome: string;
        id: string;
      }[] = [];

      data.habilidadesUtilizadas?.forEach((item) => {
        const findedHabilidade = optionsHabilidades?.find((option) => option.value === item);

        if (findedHabilidade) {
          habilidadesUtilizadas.push({
            nome: findedHabilidade.label,
            id: findedHabilidade.value
          })
        }
      });

      const postData: IPostProjeto = {
        nome: data.nome,
        periodo: data.periodo,
        cursos: [],
        descricao: data.descricao,
        habilidadesUtilizadas,
        idUser: userAuth?.id ?? "",
        link: data.link,
        tipoProjeto: data.tipoProjeto,
        imagens: data.imagens,
      };

      let result;

      if (params?.id) {
        result = await putProjeto(params.id, postData);
      } else {
        result = await postProjeto(postData);
      }

      if (result) {
        Toast.show({
          type: 'success',
          text1: 'Sucesso!',
          text2: `Projeto ${params?.id ? 'editado' : 'criado'} com sucesso!`,
        });
        setTimeout(() => router.push('/projetos'), 300);
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Erro no projeto', text2: error?.message ?? "Tente novamente mais tarde." });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function gethabilidadesData() {
    setIsLoadingHabilidades(true);
    try {
      const result = await getHabilidades(userAuth?.id ?? "");

      const formatedItems: SelectOption[] = result?.map((item) => {
        return {
          value: item.id,
          label: item.nome
        }
      }) ?? [];

      setOptionsHabilidades(formatedItems);
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Erro na habilidade', text2: error?.message ?? "Tente novamente mais tarde." });
    } finally {
      setIsLoadingHabilidades(false);
    }
  }

  async function getProjetoByIdData(idProjeto: string) {
    setIsLoadingData(true);
    try {
      const result = await getProjetoById(idProjeto);
      if (result) {
        reset({
          nome: result.nome,
          periodo: result.periodo,
          tipoProjeto: result.tipoProjeto,
          descricao: result.descricao,
          link: result.link,
          imagens: [],
          cursos: [],
          habilidadesUtilizadas: result.habilidadesUtilizadas?.map((item) => item.id) ?? [],
        });
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Erro no projeto', text2: error?.message ?? "Tente novamente mais tarde." });
    } finally {
      setIsLoadingData(false);
    }
  }

  useFocusEffect(
    useCallback(() => {

      gethabilidadesData();
      params.id && getProjetoByIdData(params.id);

      return () => {
        reset(defaultValuesCadatroProjeto);
        scrollViewRef.current?.scrollTo({ y: 0, animated: false });
      };
    }, [params.id, reset])
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View className='w-full flex flex-1 pt-10 px-8 pb-8'>
          <HeaderList
            title="Cadastrar projeto"
            onBack={() => {
              router.push('/projetos')
            }}
            disabledAdd
            hasAdd={false}
            hasDelete
            disabledDelete={!params.id}
            onPressDelete={() => {
              setIsDeleteModalVisible(true);
            }}
          />

          <ScrollView ref={scrollViewRef} className="mt-14" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20, paddingTop: 4, paddingHorizontal: 4 }}>
            <ControlledInput
              control={control}
              label='Nome do projeto*'
              name='nome'
              placeholder='Nome'
              className='mb-4'
              returnKeyType='next'
              isLoading={isLoadingData}
            />
            <ControlledDateRangeInput
              control={control}
              label='Período*'
              name='periodo'
              placeholder='dd/mm/yyyy - dd/mm/yyyy'
              className='mb-4'
              returnKeyType='next'
              isLoading={isLoadingData}
            />
            <View className="flex flex-row items-center justify-between mb-4">
              <ControlledSelect
                control={control}
                label='Habilidades utilizadas'
                name='habilidadeSelecionada'
                placeholder='Habilidade'
                className='w-4/5'
                options={optionsHabilidades}
                isLoading={isLoadingHabilidades || isLoadingData}
              />
              <Pressable className="w-1/4 flex items-center justify-center" onPress={onAddHabilidade}>
                <Ionicons name="add-circle" size={40} color="black" />
              </Pressable>
            </View>
            <View className="flex flex-row w-full flex-wrap">
              {getValues().habilidadesUtilizadas?.map((habilidade, index) => (
                <BadgeClose
                  key={index}
                  name={optionsHabilidades?.find((option) => option.value === habilidade)?.label ?? ''}
                  onPress={() => {
                    onRemoveHabilidade(habilidade);
                  }}
                />
              ))}
            </View>
            <ControlledSelect
              control={control}
              label='Tipo de projeto*'
              name='tipoProjeto'
              placeholder='Aprendizado'
              className='mb-4'
              returnKeyType='next'
              options={optionsTipoProjeto}
              isLoading={isLoadingData}
            />
            <ControlledInput
              control={control}
              label='Descrição do projeto*'
              name='descricao'
              placeholder='Descrição'
              className='mb-4'
              returnKeyType='next'
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              isLoading={isLoadingData}
            />
            <ControlledInput
              control={control}
              label='Link ou Repositório'
              name='link'
              placeholder='https://'
              keyboardType="url"
              className='mb-4'
              returnKeyType='next'
              isLoading={isLoadingData}
            />
            <View className="flex flex-row items-center justify-between mb-4">
              <ControlledSelect
                control={control}
                label='Adicionar curso'
                name='cursoSelecionado'
                placeholder='Curso'
                className='w-3/4'
                options={optionsCursos}
                isLoading={isLoadingData}
              />
              <Pressable className="w-1/4 flex items-center justify-center" onPress={onAddCursos}>
                <Ionicons name="add-circle" size={40} color="black" />
              </Pressable>
            </View>
            <View className="flex flex-row w-full flex-wrap">
              {getValues().cursos?.map((curso, index) => (
                <BadgetCloseGradient
                  key={index}
                  name={curso.descricao}
                  onPress={() => {
                    onRemoveCursos(curso.id);
                  }}
                  colors={[...Colors.orangeGradient] as [string, string, ...string[]]}
                />
              ))}
            </View>
            <ThemedText className='mb-2'>Imagens do projeto</ThemedText>
            <MultiImageUploader
              images={watch().imagens}
              setImages={(images) => setValue('imagens', images)}
            />
          </ScrollView>
          <CustomButton
            title='Salvar'
            onPress={handleSubmit(handleSubmitProjeto)}
            className="w-full mb-2 mt-auto"
            isLoading={isSubmitting}
          />
        </View>
      </KeyboardAvoidingView>
      <ConfirmationModal
        isVisible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={handleDeleteProjeto}
        title="Confirmar Exclusão"
        message="Tem certeza de que deseja excluir este projeto? Esta ação não pode ser desfeita."
        confirmButtonText="Sim, Excluir"
        isConfirming={isSubmitting}
      />
    </SafeAreaView>
  )
}