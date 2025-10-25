import { ControlledInput } from "@/components/ControlledInput";
import { ControlledSelect } from "@/components/ControlledSelect";
import { BadgeClose, BadgetCloseGradient, CustomButton, SelectOption } from "@/components/ui";
import { HeaderList } from "@/components/ui/HeaderList";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { Colors } from "@/constants/Colors";
import { CadastroHabilidadeDataForm } from "@/interfaces/cadastroHabilidade";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, Text, View } from "react-native";

export type SelectionOptionCursoProjeto = {
  tipo: "curso" | "projeto";
} & SelectOption;


const optionsProficiencia: SelectOption[] = [
  { label: 'Iniciante', value: 'iniciante' },
  { label: 'Intermediario', value: 'intermediario' },
  { label: 'Avançado', value: 'avancado' },
];

const optionsCategorias: SelectOption[] = [
  { label: 'Categoria 01', value: 1 },
  { label: 'Categoria 02', value: 2 },
  { label: 'Categoria 03', value: 3 },
  { label: 'Categoria 03', value: 4 },
  { label: 'Categoria 03', value: 5 },
  { label: 'Categoria 03', value: 6 },
  { label: 'Categoria 03', value: 7 },
  { label: 'Categoria 03', value: 8 },
  { label: 'Categoria 03', value: 9 },
  { label: 'Categoria 03', value: 10 },
  { label: 'Categoria 03', value: 11 },
  { label: 'Categoria 03', value: 12 },
  { label: 'Categoria 03', value: 13 },
  { label: 'Categoria 03', value: 14 },
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
  const [image, setImage] = useState<string | null>("");

  const {
    control,
    watch,
    getValues,
    setValue
  } = useForm<CadastroHabilidadeDataForm>({
    defaultValues: defaultValuesCadatroHabilidade
  });

  function onAddCategoria() {
    if (watch().categoriaSelecionada) {
      const categoriaSelecionada: number = getValues().categoriaSelecionada ?? 0;
      const findedCategoria = getValues().categorias.find((categoria) => categoria === watch().categoriaSelecionada);

      if (!findedCategoria) {
        setValue("categorias", [...getValues().categorias, categoriaSelecionada], {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
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

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View className='w-full flex flex-1 pt-10 px-8 pb-8'>
          <HeaderList
            onPressAdd={() => {
              //
            }}
            title="Cadastrar habilidade"
            onBack={() => {
              router.push('/minhasHabilidades')
            }}
            disabledAdd
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
            />
            <ControlledSelect
              control={control}
              label='Nível de proficiência'
              name='proficiencia'
              placeholder='Iniciante'
              className='mb-4'
              returnKeyType='next'
              options={optionsProficiencia}
            />
            <View className="flex flex-row items-center justify-between mb-4 w-full">
              <ControlledSelect
                control={control}
                label='Categoria'
                name='categoriaSelecionada'
                placeholder='Categoria'
                className='w-3/4'
                options={optionsCategorias}
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
            onPress={() => {
              //
            }}
            className="w-full mb-2 mt-auto"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}