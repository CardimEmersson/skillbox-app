import { ControlledAutocomplete } from "@/components/ControlledAutocomplete";
import { ControlledInput } from "@/components/ControlledInput";
import { ControlledSelect } from "@/components/ControlledSelect";
import { BadgeClose, BadgetCloseGradient, ConfirmationModal, CustomButton, SelectOption } from "@/components/ui";
import { HeaderList } from "@/components/ui/HeaderList";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { Colors } from "@/constants/Colors";
import { HabilidadeSchema } from "@/data/shemas/habilidadeSchema";
import { CadastroHabilidadeDataForm, TypeCursoProjeto } from "@/interfaces/cadastroHabilidade";
import { getCursos } from "@/services/modules/cursoService";
import { deleteHabilidade, getCategorias, getHabilidadeById, postCategoria, postHabilidade, putHabilidade } from "@/services/modules/habilidadeService";
import { getProjetos } from "@/services/modules/projetoService";
import { customToastError } from "@/utils/toast";
import Ionicons from "@expo/vector-icons/Ionicons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { BackHandler, FlatList, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, Text, View } from "react-native";
import Toast from "react-native-toast-message";

export type SelectionOptionCursoProjeto = {
  tipo: "curso" | "projeto";
} & SelectOption;


const optionsProficiencia: SelectOption[] = [
  { label: 'Iniciante', value: 'iniciante' },
  { label: 'Intermediario', value: 'intermediário' },
  { label: 'Avançado', value: 'avançado' },
];

const defaultValuesCadatroHabilidade: CadastroHabilidadeDataForm = {
  icone: undefined,
  nome: '',
  proficiencia: 'iniciante',
  categoriaSelecionada: undefined,
  categorias: [],
  cursoProjetoSelecionado: undefined,
  cursosProjetos: [],
}

export default function CadastroHabilidade() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const [image, setImage] = useState<string | null>("");
  const [initialOptionsCategorias, setInitialOptionsCategorias] = useState<SelectOption[]>([]);
  const [optionsCategorias, setOptionsCategorias] = useState<SelectOption[]>([]);
  const [inputValueCategoria, setInputValueCategoria] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isLoadingCategorias, setIsLoadingCategorias] = useState(false);
  const [optionsCursosProjetos, setOptionsCursosProjetos] = useState<SelectionOptionCursoProjeto[]>([]);
  const [isLoadingCursosProjetos, setIsLoadingCursosProjetos] = useState(false);

  const {
    control,
    watch,
    getValues,
    setValue,
    handleSubmit,
    reset
  } = useForm<CadastroHabilidadeDataForm>({
    defaultValues: defaultValuesCadatroHabilidade,
    resolver: yupResolver(HabilidadeSchema) as any,
  });

  function handleAddNovaCategoria(novaCategoria: string) {
    const findedCategoria = optionsCategorias?.find((categoria) => categoria.label === novaCategoria)
    if (findedCategoria) return findedCategoria;

    const novaOpcao: SelectOption = {
      label: novaCategoria,
      value: novaCategoria.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    };

    setOptionsCategorias(prev => [...prev, novaOpcao]);
    return novaOpcao;
  }

  function onAddCategoria() {
    if (watch().categoriaSelecionada) {
      const categoriaSelecionada = getValues().categoriaSelecionada ?? 0;
      const findedCategoria = getValues().categorias.find((categoria) => categoria === watch().categoriaSelecionada);

      if (!findedCategoria) {
        setValue("categorias", [...getValues().categorias, categoriaSelecionada], {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
      setInputValueCategoria('');
    }
    setValue("categoriaSelecionada", undefined, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function onRemoveCategoria(categoria: number) {
    const filteredCategorias = getValues().categorias.filter((item) => item !== categoria);
    setValue("categorias", filteredCategorias, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function onAddCursosProjetos() {
    if (watch().cursoProjetoSelecionado) {
      const cursoProjetoSelecionado: number = getValues().cursoProjetoSelecionado ?? 0;
      const findedItem = optionsCursosProjetos.find((item) => item.value === cursoProjetoSelecionado);

      if (findedItem) {
        const findedCursoProjeto = getValues().cursosProjetos.find((cursoProjeto) => cursoProjeto.id === findedItem?.value);

        if (!findedCursoProjeto) {
          setValue("cursosProjetos", [...getValues().cursosProjetos, {
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
    setValue("cursoProjetoSelecionado", undefined, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function onRemoveCursosProjetos(cursoProjeto: number) {
    const filteredCursosProjetos = getValues().cursosProjetos.filter((item) => item.id !== cursoProjeto);
    setValue("cursosProjetos", filteredCursosProjetos, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function handleInputValueCategoria(value: string) {
    setInputValueCategoria(value);
  }

  async function postCategoriasData(categorias: SelectOption[]): Promise<SelectOption[]> {
    if (categorias.length) {
      const nomesCategorias = categorias.map((item) => item.label);

      if (nomesCategorias.length) {
        const promises = nomesCategorias.map((nome) => postCategoria({
          nome
        }));
        const result = await Promise.all(promises);

        if (result.length) {
          const options: SelectOption[] = result?.map((item, index) => {
            return {
              label: nomesCategorias[index] ?? "",
              value: item?.id ?? 0,
            }
          });
          return options;
        }
      }
    }
    return [];
  }

  async function handleSubmitHabilidade(data: CadastroHabilidadeDataForm) {
    setIsSubmitting(true);
    try {
      const categoriasSelecionadas = optionsCategorias.filter((item) => data.categorias.includes(item.value));
      const novasCategoriasParaCriar = categoriasSelecionadas.filter((item) => !initialOptionsCategorias.some(initial => initial.value === item.value));
      const categoriasExistentes = categoriasSelecionadas.filter((item) => !novasCategoriasParaCriar.some(nova => nova.value === item.value));

      const categoriasCriadas = await postCategoriasData(novasCategoriasParaCriar);

      const categoriasHabilidade = [...categoriasExistentes, ...categoriasCriadas].map((item) => {
        return Number(item.value ?? 0)
      });

      const formDataHabilidade = new FormData();
      formDataHabilidade.append('nome', data.nome);
      formDataHabilidade.append('nivel', data.proficiencia);
      categoriasHabilidade.forEach((id) => {
        formDataHabilidade.append('categorias[]', id.toString());
      });
      data.cursosProjetos?.forEach((item) => {
        if (item.tipo === 'curso') {
          formDataHabilidade.append('cursos[]', item.id.toString());
        }

        if (item.tipo === 'projeto') {
          formDataHabilidade.append('projetos[]', item.id.toString());
        }
      });
      if (data.icone) {
        formDataHabilidade.append('icone', {
          uri: data.icone.uri,
          name: data.icone.fileName ?? data.icone.uri.split('/').pop() ?? 'icone.jpg',
          type: (data.icone as any).mimeType ?? 'image/jpeg',
        } as any);
      }
      if (!image && params?.id) {
        formDataHabilidade.delete('icone');
        formDataHabilidade.append('excluir_imagem', 'true');
      }

      let result;

      if (params.id) {
        result = await putHabilidade(Number(params.id), formDataHabilidade);
      } else {
        result = await postHabilidade(formDataHabilidade);
      }

      if (result) {
        Toast.show({
          type: 'success',
          text1: 'Sucesso!',
          text2: `Habilidade ${params?.id ? 'editada' : 'criada'} com sucesso!`,
        });
        setTimeout(() => router.push('/minhasHabilidades'), 300);
      }
    } catch (error: any) {
      customToastError({
        text2: error?.message ?? "Tente novamente mais tarde.",
        text1: "Erro na habilidade",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteHabilidade() {
    if (!params.id) return;
    setIsSubmitting(true);
    try {
      await deleteHabilidade(Number(params.id));
      Toast.show({
        type: 'success',
        text1: 'Sucesso!',
        text2: 'Habilidade excluída com sucesso!',
      });
      setTimeout(() => router.push('/minhasHabilidades'), 300);
    } catch (error: any) {
      customToastError({
        text2: error?.message ?? "Tente novamente mais tarde.",
        text1: "Erro ao excluir",
      });
    } finally {
      setIsSubmitting(false);
      setIsDeleteModalVisible(false);
    }
  }

  async function getCategoriasData() {
    setIsLoadingCategorias(true);
    try {
      const result = await getCategorias();

      if (result.length) {
        const options: SelectOption[] = result.map((item) => {
          return {
            label: item.nome,
            value: item.id,
          }
        });

        setOptionsCategorias(options);
        setInitialOptionsCategorias(options);
      }
    } catch (error: any) {
      customToastError({
        text2: error?.message ?? "Tente novamente mais tarde.",
        text1: "Erro na categoria",
      });
    } finally {
      setIsLoadingCategorias(false);
    }
  }

  async function getCursosProjetosData() {
    setIsLoadingCursosProjetos(true);
    try {
      const [cursos, projetos] = await Promise.all([getCursos({
        limit: 9999
      }), getProjetos({
        limit: 9999
      })]);

      const optionsCursos: SelectionOptionCursoProjeto[] = cursos?.data?.map((item) => {
        return {
          label: item.nome,
          value: item.id,
          tipo: 'curso',
        }
      }) ?? [];
      
      const optionsProjetos: SelectionOptionCursoProjeto[] = projetos?.data?.map((item) => {
        return {
          label: item.nome,
          value: item.id,
          tipo: 'projeto',
        }
      }) ?? [];

      setOptionsCursosProjetos([...optionsCursos, ...optionsProjetos]);
    } catch (error: any) {
      customToastError({
        text2: error?.message ?? "Tente novamente mais tarde.",
        text1: "Erro no curso - projeto",
      });
    } finally {
      setIsLoadingCursosProjetos(false);
    }
  }

  async function getHabilidadeByIdData(idHabilidade: number) {
    setIsLoadingData(true);
    try {
      const result = await getHabilidadeById(idHabilidade);
      if (result) {
        const cursos: TypeCursoProjeto[] = result?.cursos?.map((item) => {
          return {
            id: item.id,
            descricao: item.nome,
            tipo: 'curso'
          }
        });

        const projetos: TypeCursoProjeto[] = result?.projetos?.map((item) => {
          return {
            id: item.id,
            descricao: item.nome,
            tipo: 'projeto'
          }
        });

        setImage(result.icone ?? "");
        reset({
          categorias: result.categorias?.map((item) => item.id) ?? [],
          cursosProjetos: [...cursos, ...projetos],
          icone: undefined,
          nome: result.nome,
          proficiencia: result.nivel,
        });
      }
    } catch (error: any) {
      customToastError({
        text2: error?.message ?? "Tente novamente mais tarde.",
        text1: "Erro na habilidade",
      });
    } finally {
      setIsLoadingData(false);
    }
  }

  const onBackPress = () => {
    router.push('/minhasHabilidades');
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      getCategoriasData();
      getCursosProjetosData();

      params.id && getHabilidadeByIdData(Number(params.id));

      return () => {
        backHandler.remove();
        reset(defaultValuesCadatroHabilidade);
        setImage("");
      };
    }, [reset, params.id])
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View className='w-full flex flex-1 pt-10 px-8 pb-8'>
          <HeaderList
            title={params?.id ? "Editar habilidade" : "Cadastrar habilidade"}
            onBack={onBackPress}
            disabledAdd
            hasAdd={false}
            hasDelete
            disabledDelete={!params.id}
            onPressDelete={() => {
              setIsDeleteModalVisible(true);
            }}
          />
          <FlatList
            data={[]}
            renderItem={null}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 4 }}
            keyboardShouldPersistTaps="handled"
            ListHeaderComponent={
              <>
                <View className="w-full items-center mb-6 mt-6">
                  <ImageUploader image={image} setImage={setImage} callbackFile={(image) => {
                    setValue("icone", image, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }} />
                  <Text className='font-inter-semibold text-md text-start mr-2'>Icone</Text>
                  {!!image && (
                    <Pressable onPress={() => {
                      setImage(null);
                      setValue("icone", undefined, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }} className="flex flex-row items-center mt-2">
                      <Ionicons name="trash-outline" size={16} color="red" />
                      <Text className="text-red-500 ml-1">Remover imagem</Text>
                    </Pressable>
                  )}
                </View>

                <View>
                  <ControlledInput
                    control={control}
                    label='Nome da habilidade*'
                    name='nome'
                    placeholder='Nome'
                    className='mb-4'
                    returnKeyType='next'
                    isLoading={isLoadingData}
                  />
                  <ControlledSelect
                    control={control}
                    label='Nível de proficiência*'
                    name='proficiencia'
                    placeholder='Iniciante'
                    className='mb-4'
                    returnKeyType='next'
                    options={optionsProficiencia}
                    isLoading={isLoadingData}
                  />
                  <View className="flex flex-row items-center justify-between mb-4 w-full">
                    <ControlledAutocomplete
                      control={control}
                      label='Categoria'
                      name='categoriaSelecionada'
                      placeholder='Categoria'
                      className='w-3/4'
                      options={optionsCategorias}
                      onAddOption={handleAddNovaCategoria}
                      handleInputValue={handleInputValueCategoria}
                      inputValue={inputValueCategoria}
                      isLoading={isLoadingCategorias || isLoadingData}
                    />
                    <Pressable className={`w-1/4 flex items-center justify-center ${watch().categoriaSelecionada ? '' : 'opacity-50'}`} onPress={onAddCategoria} disabled={!watch().categoriaSelecionada}>
                      <Ionicons name="add-circle" size={40} color="black" />
                    </Pressable>
                  </View>
                  <View className="flex flex-row w-full flex-wrap">
                    {getValues().categorias?.map((categoria, index) => (
                      <BadgeClose
                        key={index}
                        name={optionsCategorias?.find((option) => option.value === categoria)?.label ?? ''}
                        onPress={() => {
                          onRemoveCategoria(categoria);
                        }}
                      />
                    ))}
                  </View>

                  <View className="flex flex-row items-center justify-between mb-4">
                    <ControlledSelect
                      control={control}
                      label='Adicionar curso ou projeto'
                      name='cursoProjetoSelecionado'
                      placeholder='Curso ou projeto'
                      className='w-3/4'
                      keyExtractor={(item: SelectionOptionCursoProjeto) => `${item.value?.toString()}-${item.tipo}`}
                      options={optionsCursosProjetos}
                      isLoading={isLoadingCursosProjetos || isLoadingData}
                    />
                    <Pressable className={`w-1/4 flex items-center justify-center ${watch().cursoProjetoSelecionado ? '' : 'opacity-50'}`} onPress={onAddCursosProjetos} disabled={!watch().cursoProjetoSelecionado}>
                      <Ionicons name="add-circle" size={40} color="black" />
                    </Pressable>
                  </View>
                  <View className="flex flex-row w-full flex-wrap">
                    {getValues().cursosProjetos?.map((cursoProjeto, index) => (
                      <BadgetCloseGradient
                        key={index}
                        name={cursoProjeto.descricao}
                        onPress={() => {
                          onRemoveCursosProjetos(cursoProjeto.id);
                        }}
                        colors={cursoProjeto.tipo === 'curso' ? [...Colors.orangeGradient] as [string, string, ...string[]] : [...Colors.blueGradient] as [string, string, ...string[]]}
                      />
                    ))}
                  </View>
                </View>
              </>
            }
          />
          <CustomButton
            title='Salvar'
            onPress={handleSubmit(handleSubmitHabilidade)}
            className={"w-full mb-1 mt-auto"}
            isLoading={isSubmitting}
          />
        </View>
      </KeyboardAvoidingView>
      <ConfirmationModal
        isVisible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={handleDeleteHabilidade}
        title="Confirmar Exclusão"
        message="Tem certeza de que deseja excluir esta habilidade? Esta ação não pode ser desfeita."
        confirmButtonText="Sim, Excluir"
        isConfirming={isSubmitting}
      />
    </SafeAreaView>
  )
}