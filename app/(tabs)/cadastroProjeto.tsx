import { ControlledDateRangeInput } from "@/components/ControlledDateRangeInput";
import { ControlledInput } from "@/components/ControlledInput";
import { ControlledSelect } from "@/components/ControlledSelect";
import { ThemedText } from "@/components/ThemedText";
import { BadgeClose, BadgetCloseGradient, CustomButton, HeaderList, MultiImageUploader, SelectOption } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { CadastroProjetoDataForm } from "@/interfaces/cadastroProjeto";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, View } from "react-native";
import { SelectionOptionCursoProjeto } from "./cadastroHabilidade";

const optionsHabilidades: SelectOption[] = [
  { label: 'Habilidade 01', value: 1 },
  { label: 'Habilidade 02', value: 2 },
  { label: 'Habilidade 03', value: 3 },
];

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

  const {
    control,
    watch,
    getValues,
    setValue
  } = useForm<CadastroProjetoDataForm>({
    defaultValues: defaultValuesCadatroProjeto
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
            title="Cadastrar projeto"
            onBack={() => {
              router.push('/projetos')
            }}
            disabledAdd
          />

          <ScrollView className="mt-14" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, paddingTop: 4, paddingHorizontal: 4 }}>
            <ControlledInput
              control={control}
              label='Nome do projeto'
              name='nome'
              placeholder='Nome'
              className='mb-4'
              returnKeyType='next'
            />
            <ControlledDateRangeInput
              control={control}
              label='Período'
              name='periodo'
              placeholder='dd/mm/yyyy - dd/mm/yyyy'
              className='mb-4'
              returnKeyType='next'
            />
            <View className="flex flex-row items-center justify-between mb-4">
              <ControlledSelect
                control={control}
                label='Habilidades utilizadas'
                name='habilidadeSelecionada'
                placeholder='Habilidade'
                className='w-4/5'
                options={optionsHabilidades}
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
              label='Tipo de projeto'
              name='tipoProjeto'
              placeholder='Aprendizado'
              className='mb-4'
              returnKeyType='next'
              options={optionsTipoProjeto}
            />
            <ControlledInput
              control={control}
              label='Descrição do projeto'
              name='descricao'
              placeholder='Descrição'
              className='mb-4'
              returnKeyType='next'
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <ControlledInput
              control={control}
              label='Link ou Repositório'
              name='link'
              placeholder='https://'
              className='mb-4'
              returnKeyType='next'
            />
            <View className="flex flex-row items-center justify-between mb-4">
              <ControlledSelect
                control={control}
                label='Adicionar curso'
                name='cursoSelecionado'
                placeholder='Curso'
                className='w-3/4'
                options={optionsCursos}
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