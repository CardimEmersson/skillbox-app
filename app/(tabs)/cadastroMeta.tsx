import { ControlledInput } from "@/components/ControlledInput";
import { ControlledSelect } from "@/components/ControlledSelect";
import { BadgeClose, ConfirmationModal, CustomButton, HeaderList, SelectOption } from "@/components/ui";
import { AuthContext } from "@/comtexts/authContext";
import { MetaSchema } from "@/data/shemas/metaSchema";
import { CadastroMetaDataForm, IPostMeta, TypeStatusMeta } from "@/interfaces/cadastroMeta";
import { getHabilidades } from "@/services/modules/habilidadeService";
import { deleteMeta, getMetaById, postMeta, putMeta } from "@/services/modules/metaService";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useContext, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";

const optionsStatus: SelectOption[] = [
  { label: 'Planejado', value: 'planejado' },
  { label: 'Em andamento', value: 'em andamento' },
  { label: 'Concluído', value: 'concluído' },
];

const defaultValuesCadatroMeta: CadastroMetaDataForm = {
  descricao: "",
  habilidadeSelecionada: undefined,
  habilidadesRelacionadas: [],
  prazoConclusao: "",
  status: "planejado",
  titulo: "",
}

export default function CadastroMeta() {
  const router = useRouter();
  const inputDescricaoRef = useRef<TextInput>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingHabilidades, setIsLoadingHabilidades] = useState(false);
  const [optionsHabilidades, setOptionsHabilidades] = useState<SelectOption[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const params = useLocalSearchParams<{ id?: string }>();
  const { userAuth } = useContext(AuthContext);

  const {
    control,
    watch,
    getValues,
    setValue,
    handleSubmit,
    reset
  } = useForm<CadastroMetaDataForm>({
    defaultValues: defaultValuesCadatroMeta,
    resolver: yupResolver(MetaSchema) as any,
  });

  function onAddHabilidade() {
    if (watch().habilidadeSelecionada) {
      const habilidadeSelecionada: string = getValues().habilidadeSelecionada ?? "";
      const findedHabilidade = getValues().habilidadesRelacionadas.find((habilidade) => habilidade === watch().habilidadeSelecionada);

      if (!findedHabilidade) {
        setValue("habilidadesRelacionadas", [...getValues().habilidadesRelacionadas, habilidadeSelecionada], {
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
    const filteredCategorias = getValues().habilidadesRelacionadas.filter((item) => item !== habilidade);
    setValue("habilidadesRelacionadas", filteredCategorias, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  async function handleSubmitMeta(data: CadastroMetaDataForm) {
    setIsSubmitting(true);
    try {
      const habilidadesRelacionadas: {
        nome: string;
        id: string;
      }[] = [];

      data.habilidadesRelacionadas?.forEach((item) => {
        const findedHabilidade = optionsHabilidades?.find((option) => option.value === item);

        if (findedHabilidade) {
          habilidadesRelacionadas.push({
            nome: findedHabilidade.label,
            id: findedHabilidade.value
          })
        }
      });

      const postData: IPostMeta = {
        titulo: data.titulo,
        descricao: data.descricao,
        habilidadesRelacionadas,
        prazoConclusao: data.prazoConclusao,
        status: data.status,
        idUser: userAuth?.id ?? "",
      }

      let result;
      if (params?.id) {
        result = await putMeta(params.id, postData);
      } else {
        result = await postMeta(postData);
      }

      if (result) {
        Toast.show({
          type: 'success',
          text1: 'Sucesso!',
          text2: `Meta ${params?.id ? 'editada' : 'criada'} com sucesso!`,
        });
        setTimeout(() => router.push('/metas'), 300);
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Erro na meta', text2: error?.message ?? "Tente novamente mais tarde." });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function getMetaByIdData(idMeta: string) {
    setIsLoadingData(true);
    try {
      const result = await getMetaById(idMeta);
      if (result) {
        reset({
          descricao: result.descricao,
          habilidadesRelacionadas: result.habilidadesRelacionadas.map((habilidade) => habilidade.id),
          prazoConclusao: result.prazoConclusao,
          status: result.status as TypeStatusMeta,
          titulo: result.titulo,
        });
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Erro na meta', text2: error?.message ?? "Tente novamente mais tarde." });
    } finally {
      setIsLoadingData(false);
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

  async function handleDeleteMeta() {
    if (!params.id) return;
    setIsSubmitting(true);
    try {
      await deleteMeta(params.id);
      Toast.show({
        type: 'success',
        text1: 'Sucesso!',
        text2: 'meta excluída com sucesso!',
      });
      setTimeout(() => router.push('/metas'), 300);
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
      params.id && getMetaByIdData(params.id);

      return () => {
        reset(defaultValuesCadatroMeta);
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
            title="Cadastrar meta"
            onBack={() => {
              router.push('/metas')
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
              label='Título da meta*'
              name='titulo'
              placeholder='Título'
              className='mb-4'
              returnKeyType='next'
              onSubmitEditing={() => inputDescricaoRef?.current?.focus()}
              isLoading={isLoadingData}
            />
            <ControlledInput
              ref={inputDescricaoRef}
              control={control}
              label='Descrição*'
              name='descricao'
              placeholder='Descrição'
              className='mb-4'
              returnKeyType='next'
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              isLoading={isLoadingData}
            />
            <View className="flex flex-row items-center justify-between mb-4">
              <ControlledSelect
                control={control}
                label='Habilidades relacionadas'
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
              {getValues().habilidadesRelacionadas?.map((habilidade, index) => (
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
              label='Prazo de conclusão*'
              name='prazoConclusao'
              placeholder='dd/mm/yyyy'
              className='mb-4'
              type='date'
              returnKeyType='next'
              isLoading={isLoadingData}
            />
            <ControlledSelect
              control={control}
              label='Status da meta*'
              name='status'
              placeholder='Planejado'
              className='mb-4'
              returnKeyType='next'
              options={optionsStatus}
              isLoading={isLoadingData}
            />

          </ScrollView>
          <CustomButton
            title='Salvar'
            onPress={handleSubmit(handleSubmitMeta)}
            className="w-full mb-2 mt-auto"
            isLoading={isSubmitting}
          />
        </View>
      </KeyboardAvoidingView>
      <ConfirmationModal
        isVisible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={handleDeleteMeta}
        title="Confirmar Exclusão"
        message="Tem certeza de que deseja excluir esta meta? Esta ação não pode ser desfeita."
        confirmButtonText="Sim, Excluir"
        isConfirming={isSubmitting}
      />
    </SafeAreaView>
  )
}