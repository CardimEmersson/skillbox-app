import { ControlledAutocomplete } from "@/components/ControlledAutocomplete";
import { ControlledInput } from "@/components/ControlledInput";
import { ControlledSelect } from "@/components/ControlledSelect";
import { BadgeClose, BadgetCloseGradient, ConfirmationModal, CustomButton, SelectOption } from "@/components/ui";
import { HeaderList } from "@/components/ui/HeaderList";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { AuthContext } from "@/comtexts/authContext";
import { Colors } from "@/constants/Colors";
import { HabilidadeSchema } from "@/data/shemas/habilidadeSchema";
import { CadastroHabilidadeDataForm, IPostHabilidade } from "@/interfaces/cadastroHabilidade";
import { deleteHabilidade, getCategorias, getHabilidadeById, postCategoria, postHabilidade } from "@/services/modules/habilidadeService";
import Ionicons from "@expo/vector-icons/Ionicons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, Text, View } from "react-native";
import Toast from "react-native-toast-message";

export type SelectionOptionCursoProjeto = {
  tipo: "curso" | "projeto";
} & SelectOption;


const optionsProficiencia: SelectOption[] = [
  { label: 'Iniciante', value: 'iniciante' },
  { label: 'Intermediario', value: 'intermediario' },
  { label: 'Avançado', value: 'avancado' },
];

const optionsCursosProjetos: SelectionOptionCursoProjeto[] = [
  { label: 'Curso 01', value: 1, tipo: 'curso' },
  { label: 'Projeto 01', value: 2, tipo: 'projeto' },
  { label: 'Curso 02', value: 3, tipo: 'curso' },
  { label: 'Projeto 02', value: 4, tipo: 'projeto' },
];

const defaultValuesCadatroHabilidade: CadastroHabilidadeDataForm = {
  icone: '',
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
  const { userAuth } = useContext(AuthContext);
  const [image, setImage] = useState<string | null>("");
  const [initialOptionsCategorias, setInitialOptionsCategorias] = useState<SelectOption[]>([]);
  const [optionsCategorias, setOptionsCategorias] = useState<SelectOption[]>([]);
  const [inputValueCategoria, setInputValueCategoria] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isLoadingCategorias, setIsLoadingCategorias] = useState(false);

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
      const categoriaSelecionada = getValues().categoriaSelecionada ?? "";
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

  function onRemoveCategoria(categoria: string) {
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
          idUser: userAuth?.id ?? "",
          nome
        }));
        const result = await Promise.all(promises);

        if (result.length) {
          const options: SelectOption[] = result?.map((item) => {
            return {
              label: item?.nome ?? "",
              value: item?.id ?? "",
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
        return item.value
      });

      const postData: IPostHabilidade = {
        categorias: categoriasHabilidade,
        nome: data.nome,
        proficiencia: data.proficiencia,
        cursosProjetos: [],
        idUser: userAuth?.id ?? "",
      }

      const result = await postHabilidade(postData);

      if (result) {
        Toast.show({
          type: 'success',
          text1: 'Sucesso!',
          text2: 'Habilidade criada com sucesso!',
        });
        router.push('/minhasHabilidades');
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Erro na habilidade', text2: error?.message ?? "Tente novamente mais tarde." });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteHabilidade() {
    if (!params.id) return;
    setIsSubmitting(true);
    try {
      await deleteHabilidade(params.id);
      Toast.show({
        type: 'success',
        text1: 'Sucesso!',
        text2: 'Habilidade excluída com sucesso!',
      });
      router.push('/minhasHabilidades');
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Erro ao excluir', text2: error?.message ?? "Tente novamente mais tarde." });
    } finally {
      setIsSubmitting(false);
      setIsDeleteModalVisible(false);
    }
  }

  async function getCategoriasData() {
    setIsLoadingCategorias(true);
    try {
      const result = await getCategorias(userAuth?.id ?? "");

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
      Toast.show({ type: 'error', text1: 'Erro na categoria', text2: error?.message ?? "Tente novamente mais tarde." });
    } finally {
      setIsLoadingCategorias(false);
    }
  }

  async function getHabilidadeByIdData(idHabilidade: string) {
    setIsLoadingData(true);
    try { 
      const result = await getHabilidadeById(idHabilidade);
      if (result) {
        reset({
          categorias: result.categorias,
          cursosProjetos: [],
          icone: "",
          nome: result.nome,
          proficiencia: result.proficiencia,
        });
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Erro na habilidade', text2: error?.message ?? "Tente novamente mais tarde." });
    } finally {
      setIsLoadingData(false);
    }
  }

  useFocusEffect(
    useCallback(() => {

      getCategoriasData();

      params.id && getHabilidadeByIdData(params.id);

      return () => {
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
            title="Cadastrar habilidade"
            onBack={() => {
              router.push('/minhasHabilidades')
            }}
            disabledAdd
            hasAdd={false}
            hasDelete
            disabledDelete={!params.id}
            onPressDelete={() => {
              setIsDeleteModalVisible(true);
            }}
          />

          <View className="w-full items-center mb-6 mt-6">
            <ImageUploader image={image} setImage={setImage} />
            <Text className='font-inter-semibold text-md text-start mr-2'>Icone</Text>
          </View>

          <View>
            <ControlledInput
              control={control}
              label='Nome da habilidade'
              name='nome'
              placeholder='Nome'
              className='mb-4'
              returnKeyType='next'
              isLoading={isLoadingData}
            />
            <ControlledSelect
              control={control}
              label='Nível de proficiência'
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
              <Pressable className="w-1/4 flex items-center justify-center" onPress={onAddCategoria}>
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
                options={optionsCursosProjetos}
              />
              <Pressable className="w-1/4 flex items-center justify-center" onPress={onAddCursosProjetos}>
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
      <Toast />
    </SafeAreaView>
  )
}