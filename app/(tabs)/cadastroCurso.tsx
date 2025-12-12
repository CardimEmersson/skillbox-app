import { ControlledInput } from "@/components/ControlledInput";
import { ControlledSelect } from "@/components/ControlledSelect";
import { ThemedText } from "@/components/ThemedText";
import { BadgeClose, Checkbox, ConfirmationModal, CustomButton, HeaderList, MultiImageUploader, SelectOption } from "@/components/ui";
import { AuthContext } from "@/comtexts/authContext";
import { CursoSchema } from "@/data/shemas/cursoSchema";
import { CadastroCursoDataForm, IPostCurso } from "@/interfaces/cadastroCurso";
import { deleteCurso, getCursoById, postCurso, putCurso } from "@/services/modules/cursoService";
import { getHabilidades } from "@/services/modules/habilidadeService";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useContext, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, TextInput, View } from "react-native";
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
  const { userAuth } = useContext(AuthContext);
  const params = useLocalSearchParams<{ id?: string }>();
  const inputPlataformaInstituicaoRef = useRef<TextInput>(null);
  const inputDataConclusaoRef = useRef<TextInput>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingHabilidades, setIsLoadingHabilidades] = useState(false);
  const [optionsHabilidades, setOptionsHabilidades] = useState<SelectOption[]>([]);
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
      const habilidadeSelecionada: string = getValues().habilidadeSelecionada ?? "";
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

  function onRemoveHabilidade(habilidade: string) {
    const filteredCategorias = getValues().habilidadesDesenvolvidas.filter((item) => item !== habilidade);
    setValue("habilidadesDesenvolvidas", filteredCategorias, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  async function handleSubmitCurso(data: CadastroCursoDataForm) {
    setIsSubmitting(true);
    try {
      const habilidadesDesenvolvidas: {
        nome: string;
        id: string;
      }[] = [];

      data.habilidadesDesenvolvidas?.forEach((item) => {
        const findedHabilidade = optionsHabilidades?.find((option) => option.value === item);

        if (findedHabilidade) {
          habilidadesDesenvolvidas.push({
            nome: findedHabilidade.label,
            id: findedHabilidade.value
          })
        }
      });

      const postData: IPostCurso = {
        nome: data.nome,
        plataformaInstituicao: data.plataformaInstituicao,
        dataConclusao: data.dataConclusao,
        emAndamento: data.emAndamento,
        cargaHoraria: data.cargaHoraria,
        habilidadesDesenvolvidas,
        link: data.link,
        imagens: data.imagens,
        idUser: userAuth?.id ?? "",
      }

      let result;
      if (params?.id) {
        result = await putCurso(params.id, postData);
      } else {
        result = await postCurso(postData);
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
      Toast.show({ type: 'error', text1: 'Erro no curso', text2: error?.message ?? "Tente novamente mais tarde." });
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

  async function getCursoByIdData(idCurso: string) {
    setIsLoadingData(true);
    try {
      const result = await getCursoById(idCurso);
      if (result) {
        reset({
          nome: result.nome,
          plataformaInstituicao: result.plataformaInstituicao,
          dataConclusao: result.dataConclusao,
          emAndamento: result.emAndamento,
          cargaHoraria: result.cargaHoraria,
          habilidadesDesenvolvidas: result.habilidadesDesenvolvidas.map((habilidade) => habilidade.id),
          link: result.link,
          imagens: result.imagens,
        });
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Erro no curso', text2: error?.message ?? "Tente novamente mais tarde." });
    } finally {
      setIsLoadingData(false);
    }
  }

  async function handleDeleteCurso() {
    if (!params.id) return;
    setIsSubmitting(true);
    try {
      await deleteCurso(params.id);
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

  useFocusEffect(
    useCallback(() => {

      gethabilidadesData();
      params.id && getCursoByIdData(params.id);

      return () => {
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
            onBack={() => {
              router.push('/cursos')
            }}
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
              <Pressable className="w-1/4 flex items-center justify-center" onPress={onAddHabilidade}>
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
              isLoading={isLoadingData}
            />
            <ThemedText className='mb-2'>Upload de imagens</ThemedText>
            <MultiImageUploader
              images={watch().imagens}
              setImages={(images) => setValue('imagens', images)}
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