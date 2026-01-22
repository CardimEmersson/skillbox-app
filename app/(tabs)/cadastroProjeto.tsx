import { ControlledDateRangeInput } from "@/components/ControlledDateRangeInput";
import { ControlledInput } from "@/components/ControlledInput";
import { ControlledSelect } from "@/components/ControlledSelect";
import { ThemedText } from "@/components/ThemedText";
import { BadgeClose, BadgetCloseGradient, ConfirmationModal, CustomButton, HeaderList, MultiImageUploader, SelectOption, TypeImage } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { ProjetoSchema } from "@/data/shemas/projetoSchema";
import { CadastroProjetoDataForm } from "@/interfaces/cadastroProjeto";
import { getCursos } from "@/services/modules/cursoService";
import { getHabilidades } from "@/services/modules/habilidadeService";
import { deleteProjeto, getProjetoById, postProjeto, putProjeto } from "@/services/modules/projetoService";
import { convertDateToIso, convertIsoToDate } from "@/utils/date";
import { customToastError } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { BackHandler, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, View } from "react-native";
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
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [optionsHabilidades, setOptionsHabilidades] = useState<SelectOption[]>([]);
  const [optionsCursos, setOptionsCursos] = useState<SelectionOptionCursoProjeto[]>([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [images, setImages] = useState<TypeImage[]>([]);
  const [initialImages, setInitialImages] = useState<TypeImage[]>([]);
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
      const habilidadeSelecionada: number = getValues().habilidadeSelecionada ?? 0;
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

  function onRemoveHabilidade(habilidade: number) {
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
      await deleteProjeto(Number(params.id));
      Toast.show({
        type: 'success',
        text1: 'Sucesso!',
        text2: 'projeto excluído com sucesso!',
      });
      setTimeout(() => router.push('/projetos'), 300);
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Erro ao excluir', text2: error?.message ?? "Tente novamente mais tarde." });
      customToastError({
        text1: 'Erro ao excluir',
        text2: error?.message ?? "Tente novamente mais tarde.",
      });
    } finally {
      setIsSubmitting(false);
      setIsDeleteModalVisible(false);
    }
  }

  async function handleSubmitProjeto(data: CadastroProjetoDataForm) {
    setIsSubmitting(true);
    try {
      const excluir_imagens_ids: number[] = [];
      initialImages?.forEach((item) => {
        if (!images.some((image) => image.id === item.id)) {
          item.id && excluir_imagens_ids.push(item.id);
        }
      });

      const [periodoInicial, periodoFinal] = data.periodo.split(' - ');

      const formDataProjeto = new FormData();
      formDataProjeto.append('nome', data.nome);
      periodoInicial && formDataProjeto.append('periodo_inicial', convertDateToIso(periodoInicial ?? ""));
      periodoFinal && formDataProjeto.append('periodo_final', convertDateToIso(periodoFinal ?? ""));
      formDataProjeto.append('tipo_projeto', data.tipoProjeto);
      formDataProjeto.append('descricao', data.descricao);
      formDataProjeto.append('link', data.link);
      data.imagens?.forEach((item) => {
        formDataProjeto.append('imagens', {
          uri: item.uri,
          name: item.fileName ?? item.uri.split('/').pop() ?? 'imagem.jpg',
          type: (item as any).mimeType ?? 'image/jpeg',
        } as any);
      });
      data.cursos?.forEach((item) => {
        formDataProjeto.append('cursos[]', item.id.toString());
      });
      data.habilidadesUtilizadas?.forEach((item) => {
        formDataProjeto.append('habilidades[]', item.toString());
      });
      excluir_imagens_ids?.forEach((item) => {
        formDataProjeto.append('excluir_imagens_ids[]', item.toString());
      });

      let result;

      if (params?.id) {
        result = await putProjeto(Number(params.id), formDataProjeto);
      } else {
        result = await postProjeto(formDataProjeto);
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
      customToastError({
        text1: 'Erro no projeto',
        text2: error?.message ?? "Tente novamente mais tarde.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function getOptionsData() {
    setIsLoadingOptions(true);
    try {
      const [habilidades, cursos] = await Promise.all([getHabilidades({
        limit: 9999
      }), getCursos({
        limit: 9999
      })]);

      const formatedItemsHabilidades: SelectOption[] = habilidades?.data?.map((item) => {
        return {
          value: item.id,
          label: item.nome
        }
      }) ?? [];
     
      const formatedItemsCursos: SelectionOptionCursoProjeto[] = cursos?.data?.map((item) => {
        return {
          value: item.id,
          label: item.nome,
          tipo: 'curso'
        }
      }) ?? [];

      setOptionsHabilidades(formatedItemsHabilidades);
      setOptionsCursos(formatedItemsCursos);
    } catch (error: any) {
      customToastError({
        text1: 'Erro na habilidade - cursos',
        text2: error?.message ?? "Tente novamente mais tarde.",
      });
    } finally {
      setIsLoadingOptions(false);
    }
  }

  async function getProjetoByIdData(idProjeto: number) {
    setIsLoadingData(true);
    try {
      const result = await getProjetoById(idProjeto);
      if (result) {

        const periodo = `${convertIsoToDate(result.periodo_inicial)} - ${convertIsoToDate(result.periodo_final)}`;

        reset({
          nome: result.nome,
          periodo: periodo,
          tipoProjeto: result.tipo_projeto,
          descricao: result.descricao,
          link: result.link,
          imagens: [],
          cursos: result.cursos?.map((item) => ({
            id: item.curso_id,
            descricao: item.nome,
            tipo: 'curso'
          })) ?? [],
          habilidadesUtilizadas: result.habilidades?.map((item) => item.habilidade_id) ?? [],
        });
        setImages(result?.imagens?.map((item) => ({
          id: item.id,
          url: item.imagem_url,
        })) ?? []);
        setInitialImages(result?.imagens?.map((item) => ({
          id: item.id,
          url: item.imagem_url,
        })) ?? []);
      }
    } catch (error: any) {
      customToastError({
        text1: 'Erro no projeto',
        text2: error?.message ?? "Tente novamente mais tarde.",
      });
    } finally {
      setIsLoadingData(false);
    }
  }

  const onBackPress = () => {
    router.push('/projetos');
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      getOptionsData();
      params.id && getProjetoByIdData(Number(params.id));

      return () => {
        backHandler.remove();
        reset(defaultValuesCadatroProjeto);
        setImages([]);
        setInitialImages([]);
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
            onBack={onBackPress}
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
                isLoading={isLoadingOptions || isLoadingData}
              />
              <Pressable className={`w-1/4 flex items-center justify-center ${watch().habilidadeSelecionada ? '' : 'opacity-50'}`} onPress={onAddHabilidade} disabled={!watch().habilidadeSelecionada}>
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
                isLoading={isLoadingData || isLoadingOptions}
              />
              <Pressable className={`w-1/4 flex items-center justify-center ${watch().cursoSelecionado ? '' : 'opacity-50'}`} disabled={!watch().cursoSelecionado} onPress={onAddCursos}>
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
              images={images}
              setImages={(images) => setImages(images)}
              callbackFiles={(images) => {
                setValue('imagens', images)
              }}
              selectionLimit={4 - images.length}
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