import { ControlledInput } from "@/components/ControlledInput";
import { ControlledSelect } from "@/components/ControlledSelect";
import { ThemedText } from "@/components/ThemedText";
import { BadgeClose, Checkbox, ConfirmationModal, CustomButton, HeaderList, MultiImageUploader, SelectOption, TypeImage } from "@/components/ui";
import { CursoSchema } from "@/data/shemas/cursoSchema";
import { CadastroCursoDataForm } from "@/interfaces/cadastroCurso";
import { deleteCurso, getCursoById, postCurso, putCurso } from "@/services/modules/cursoService";
import { getHabilidades } from "@/services/modules/habilidadeService";
import { convertDateToIso, convertIsoToDate } from "@/utils/date";
import { customToastError } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BackHandler, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";

const defaultValuesCadatroCurso: CadastroCursoDataForm = {
  nome: "",
  plataformaInstituicao: "",
  dataConclusao: "",
  emAndamento: false,
  cargaHoraria: "",
  habilidadeSelecionada: undefined,
  habilidadesDesenvolvidas: [],
  link: "",
  imagens: [],
}

export default function CadastroCurso() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const inputPlataformaInstituicaoRef = useRef<TextInput>(null);
  const inputDataConclusaoRef = useRef<TextInput>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingHabilidades, setIsLoadingHabilidades] = useState(false);
  const [optionsHabilidades, setOptionsHabilidades] = useState<SelectOption[]>([]);
  const [images, setImages] = useState<TypeImage[]>([]);
  const [initialImages, setInitialImages] = useState<TypeImage[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const {
    control,
    watch,
    getValues,
    setValue,
    handleSubmit,
    reset
  } = useForm<CadastroCursoDataForm>({
    defaultValues: defaultValuesCadatroCurso,
    resolver: yupResolver(CursoSchema) as any,
  });

  function onAddHabilidade() {
    if (watch().habilidadeSelecionada) {
      const habilidadeSelecionada: number = getValues().habilidadeSelecionada ?? 0;
      const findedHabilidade = getValues().habilidadesDesenvolvidas.find((habilidade) => habilidade === watch().habilidadeSelecionada);

      if (!findedHabilidade) {
        setValue("habilidadesDesenvolvidas", [...getValues().habilidadesDesenvolvidas, habilidadeSelecionada], {
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
    const filteredCategorias = getValues().habilidadesDesenvolvidas.filter((item) => item !== habilidade);
    setValue("habilidadesDesenvolvidas", filteredCategorias, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  async function handleSubmitCurso(data: CadastroCursoDataForm) {
    setIsSubmitting(true);
    try {
      const excluir_imagens_ids: number[] = [];
      initialImages?.forEach((item) => {
        if (!images.some((image) => image.id === item.id)) {
          item.id && excluir_imagens_ids.push(item.id);
        }
      });

      const formDataCurso = new FormData();
      formDataCurso.append('nome', data.nome);
      formDataCurso.append('plataforma_instituicao', data.plataformaInstituicao);
      data.dataConclusao && formDataCurso.append('prazo_conclusao', convertDateToIso(data.dataConclusao));
      formDataCurso.append('em_andamento', data.emAndamento.toString());
      formDataCurso.append('carga_horaria', data.cargaHoraria);
      formDataCurso.append('link', data.link);
      data.imagens?.forEach((item) => {
        formDataCurso.append('imagens', {
          uri: item.uri,
          name: item.fileName ?? item.uri.split('/').pop() ?? 'imagem.jpg',
          type: (item as any).mimeType ?? 'image/jpeg',
        } as any);
      });
      data.habilidadesDesenvolvidas?.forEach((item) => {
        formDataCurso.append('habilidades[]', item.toString());
      });
      excluir_imagens_ids?.forEach((item) => {
        formDataCurso.append('excluir_imagens_ids[]', item.toString());
      });

      let result;
      if (params?.id) {
        result = await putCurso(Number(params.id), formDataCurso);
      } else {
        result = await postCurso(formDataCurso);
      }

      if (result) {
        Toast.show({
          type: 'success',
          text1: 'Sucesso!',
          text2: `Curso ${params?.id ? 'editado' : 'criado'} com sucesso!`,
        });
        setTimeout(() => router.push('/cursos'), 300);
      }
    } catch (error: any) {
      customToastError({
        text1: 'Erro no curso',
        text2: error?.message ?? "Tente novamente mais tarde.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function gethabilidadesData() {
    setIsLoadingHabilidades(true);
    try {
      const result = await getHabilidades({
        limit: 9999
      });

      const formatedItems: SelectOption[] = result?.data?.map((item) => {
        return {
          value: item.id,
          label: item.nome
        }
      }) ?? [];

      setOptionsHabilidades(formatedItems);
    } catch (error: any) {
      customToastError({
        text1: 'Erro na habilidade',
        text2: error?.message ?? "Tente novamente mais tarde.",
      });
    } finally {
      setIsLoadingHabilidades(false);
    }
  }

  async function getCursoByIdData(idCurso: number) {
    setIsLoadingData(true);
    try {
      const result = await getCursoById(idCurso);

      if (result) {
        reset({
          nome: result.nome ?? "",
          plataformaInstituicao: result.plataforma_instituicao ?? "",
          dataConclusao: convertIsoToDate(result.prazo_conclusao ?? ""),
          emAndamento: result.em_andamento ?? false,
          cargaHoraria: result.carga_horaria?.toString() ?? "",
          habilidadesDesenvolvidas: result.habilidades.map((habilidade) => habilidade.id),
          link: result.link,
          imagens: [],
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
        text1: 'Erro no curso',
        text2: error?.message ?? "Tente novamente mais tarde.",
      });
    } finally {
      setIsLoadingData(false);
    }
  }

  async function handleDeleteCurso() {
    if (!params.id) return;
    setIsSubmitting(true);
    try {
      await deleteCurso(Number(params.id));
      Toast.show({
        type: 'success',
        text1: 'Sucesso!',
        text2: 'Curso excluído com sucesso!',
      });
      setTimeout(() => router.push('/cursos'), 300);
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Erro ao excluir', text2: error?.message ?? "Tente novamente mais tarde." });
    } finally {
      setIsSubmitting(false);
      setIsDeleteModalVisible(false);
    }
  }

  const onBackPress = () => {
    router.push('/cursos');
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      gethabilidadesData();
      params.id && getCursoByIdData(Number(params.id));

      return () => {
        backHandler.remove();
        reset(defaultValuesCadatroCurso);
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
            title="Cadastrar curso"
            onBack={onBackPress}
            disabledAdd
            hasAdd={false}
            hasDelete
            disabledDelete={!params.id}
            onPressDelete={() => {
              setIsDeleteModalVisible(true);
            }}
          />

          <ScrollView className="mt-14" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, paddingTop: 4, paddingHorizontal: 4 }}>
            <ControlledInput
              control={control}
              label='Nome do curso*'
              name='nome'
              placeholder='Nome'
              className='mb-4'
              returnKeyType='next'
              onSubmitEditing={() => inputPlataformaInstituicaoRef?.current?.focus()}
              isLoading={isLoadingData}
            />
            <ControlledInput
              ref={inputPlataformaInstituicaoRef}
              control={control}
              label='Plataforma ou instituição*'
              name='plataformaInstituicao'
              placeholder='Plataforma ou instituição'
              className='mb-4'
              returnKeyType='next'
              onSubmitEditing={() => inputDataConclusaoRef?.current?.focus()}
              isLoading={isLoadingData}
            />
            <ControlledInput
              ref={inputDataConclusaoRef}
              control={control}
              label='Data de conclusão'
              name='dataConclusao'
              placeholder='dd/mm/yyyy'
              className='mb-4'
              type='date'
              returnKeyType='next'
              onChangeText={() => {
                setValue('emAndamento', false);
              }}
              isLoading={isLoadingData}
              editable={!watch().emAndamento}
              minimumDate={new Date()}
            />
            <Controller
              control={control}
              name="emAndamento"

              render={({ field: { onChange, value } }) => (
                <Checkbox
                  label="Em andamento"
                  value={value}
                  onChange={(checked) => {
                    checked && setValue('dataConclusao', '', {
                      shouldDirty: true,
                      shouldValidate: true,
                    });

                    onChange(checked);
                  }}
                  className="mb-4"
                />
              )}
            />
            <ControlledInput
              control={control}
              label='Carga horária*'
              name='cargaHoraria'
              placeholder='Carga horária'
              className='mb-4'
              returnKeyType='next'
              isLoading={isLoadingData}
            />
            <View className="flex flex-row items-center justify-between mb-4">
              <ControlledSelect
                control={control}
                label='Habilidades Desenvolvidas'
                name='habilidadeSelecionada'
                placeholder='Habilidade'
                className='w-4/5'
                options={optionsHabilidades}
                isLoading={isLoadingData || isLoadingHabilidades}
              />
              <Pressable className={`w-1/4 flex items-center justify-center ${watch().habilidadeSelecionada ? '' : 'opacity-50'}`} onPress={onAddHabilidade} disabled={!watch().habilidadeSelecionada}>
                <Ionicons name="add-circle" size={40} color="black" />
              </Pressable>
            </View>
            <View className="flex flex-row w-full flex-wrap">
              {getValues().habilidadesDesenvolvidas?.map((habilidade, index) => (
                <BadgeClose
                  key={index}
                  name={optionsHabilidades?.find((option) => option.value === habilidade)?.label ?? ''}
                  onPress={() => {
                    onRemoveHabilidade(habilidade);
                  }}
                />
              ))}
            </View>
            <ControlledInput
              control={control}
              label='Link do curso'
              name='link'
              placeholder='https://'
              className='mb-4'
              returnKeyType='next'
              keyboardType="url"
              isLoading={isLoadingData}
            />
            <ThemedText className='mb-2'>Upload de imagens</ThemedText>
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
            onPress={handleSubmit(handleSubmitCurso)}
            isLoading={isSubmitting}
            className="w-full mb-2 mt-auto"
          />
        </View>
      </KeyboardAvoidingView>
      <ConfirmationModal
        isVisible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={handleDeleteCurso}
        title="Confirmar Exclusão"
        message="Tem certeza de que deseja excluir este curso? Esta ação não pode ser desfeita."
        confirmButtonText="Sim, Excluir"
        isConfirming={isSubmitting}
      />
    </SafeAreaView>
  )
}